import express from 'express';
import { CronJob } from 'cron';
import { app, query, errorHandler, uuid } from 'mu';
import parse from 'csv-parse/lib/sync';
import fs from 'fs-extra';
import path from 'path';
import concat from 'concat';
import request from 'request';
import loadSources from './lib/data-sources';
import publish from './lib/publication';
import tasks from './config/tasks';

/** Schedule cron job */
const cronFrequency = process.env.CRON_PATTERN || '0 0 2 * * *';
new CronJob(cronFrequency, function() {
  console.log(`Data conversion triggered by cron job at ${new Date().toISOString()}`);
  request.post('http://localhost/conversion-tasks');
}, null, true);


const outputDirectory = process.env.OUTPUT_DIRECTORY || '/output';

// Static hosting of TTL files to LOAD in triple store
[outputDirectory, '/app/static'].forEach(folder => {
  app.use(express.static(folder, {
    index: false,
    setHeaders(res, path, stat) {
      if (path.endsWith('.ttl'))
        res.type('application/x-turtle');
    }
  }));
});

app.post('/conversion-tasks', function(req, res, next) {
  convert(); // don't await the conversion
  return res.status(202).send();
});

app.use(errorHandler);


// Helpers

const convert = async function() {
  try {
    await loadSources(tasks);

    console.log('Start mapping');
    const taskPromises = tasks.map(async function(task) {
      const input = await fs.readFile(task.inputFile, 'utf8');
      const records = JSON.parse(input);
      const ttl = task.mapper(records);
      await fs.outputFile(task.outputFile, ttl);

      const status = { title: task.title, inputFile: task.inputFile, count: records.length };
      console.log(JSON.stringify(status));
      return status;
    });

    const taskStatuses = await Promise.all(taskPromises);

    // const taskOutputs = tasks.map(t => t.outputFile);
    // const outputFileId = uuid();
    // const outputFile = `${outputDirectory}/${outputFileId}.ttl`;
    // await concat(taskOutputs, outputFile);

    // await publish(outputFileId);

    // request.post('http://cache/clear');
    // Promise.all(taskOutputs.map(file => fs.remove(file)));
  } catch(e) {
    console.error('Something went wrong during the conversion');
    console.error(e.message || e);
  }
};
