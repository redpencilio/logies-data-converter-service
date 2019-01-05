import express from 'express';
import { CronJob } from 'cron';
import { app, query, errorHandler, uuid } from 'mu';
import parse from 'csv-parse/lib/sync';
import fs from 'fs-extra';
import path from 'path';
import concat from 'concat';
import request from 'request';
import loadSources from './lib/data-sources';
import { mapBaseRegistry, mapTvaRegistry } from './lib/logies-mapper';
import publish from './lib/publication';

const tasks = [
  {
    title: 'Base registry',
    inputFile: '/input/base_registry.csv',
    url: 'http://opendata.visitflanders.org/sector/accommodation/base_registry.csv?limit=-1',
    outputFile: '/tmp/base_registry.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'TVA registry',
    inputFile: '/input/tva-registry.csv',
    url: 'http://opendata.visitflanders.org/sector/accommodation/tva-registry.csv?limit=-1',
    outputFile: '/tmp/tva_registry.ttl',
    mapper: mapTvaRegistry
  }
];


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

const csvOptions = {
  //  columns: true, // first line contains colum_name to create object per line,
  columns: function(row) {
    row[0] = 'business_product_id';
    return row;
  },
  delimiter: ';',
  quote: '"',
  escape: '\\',
  skip_empty_lines: true,
  skip_lines_with_error: true,
  ltrim: true,
  rtrim: true
};

app.post('/conversion-tasks', async function(req, res, next) {
  try {
    await loadSources(tasks);

    console.log('Start mapping');
    const taskPromises = tasks.map(async function(task) {
      const input = await fs.readFile(task.inputFile, 'utf8');
      const records = parse(input, csvOptions);
      const ttl = task.mapper(records);
      await fs.outputFile(task.outputFile, ttl);

      return { title: task.title, inputFile: task.inputFile, count: records.length };
    });

    const taskStatuses = await Promise.all(taskPromises);

    const taskOutputs = tasks.map(t => t.outputFile);
    const outputFileId = uuid();
    const outputFile = `${outputDirectory}/${outputFileId}.ttl`;
    await concat(taskOutputs, outputFile);

    await publish(outputFileId);

    request.post('http://cache/clear');
    Promise.all(taskOutputs.map(file => fs.remove(file)));

    return res.status(200).send(taskStatuses);
  } catch(e) {
    console.error(e.message);
    return next(new Error(e.message));
  }
});

app.use(errorHandler);
