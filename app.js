import { CronJob } from 'cron';
import { app, errorHandler } from 'mu';
import fs from 'fs-extra';
import request from 'request';
import loadSources from './data-sources';
import publish from './publication';
import { loadTasksFromConfig } from './task';
import { waitForDatabase } from './helpers/database-helpers';
import uriGenerator from './helpers/uri-helpers';

const tasks = loadTasksFromConfig();
waitForDatabase(() => {
  uriGenerator.init().then(() => {
    /** Schedule cron job */
    const cronFrequency = process.env.CRON_PATTERN || '0 0 2 * * *';
    new CronJob(cronFrequency, function() {
      console.log(`Data conversion triggered by cron job at ${new Date().toISOString()}`);
      request.post('http://localhost/conversion-tasks');
    }, null, true);

    app.post('/conversion-tasks', function(req, res, next) {
      convert(); // don't await the conversion
      return res.status(202).send();
    });

    app.use(errorHandler);

    // Run conversion on startup
    convert(uriGenerator);
  });
});

// Helpers

const convert = async function() {
  try {
    await loadSources(tasks);

    console.log('Start mapping');
    const results = await Promise.all(
      tasks.map(async function(task) {
        const result = await task.execute();
        console.log(`Finished mapping ${result.title}`);
        return result;
      })
    );

    console.log('\nMapping summary:');
    results.forEach((result) => {
      console.log(`- ${result.title}: ${result.count} records (source: ${result.source})`);
    });

    console.log('\nPublishing generated data');
    await publish(tasks);
  } catch(e) {
    console.error('Something went wrong during the conversion');
    console.error(e.message || e);
    console.trace(e);
  }
};
