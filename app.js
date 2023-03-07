import { CronJob } from 'cron';
import { app, errorHandler } from 'mu';
import fs from 'fs-extra';
import loadSources from './data-sources';
import publish from './publication';
import { loadTasksFromConfig } from './task';
import { waitForDatabase } from './helpers/database-helpers';
import uriGenerator from './helpers/uri-helpers';
import { RUN_ON_STARTUP, LOAD_EXTERNAL_SQL_SOURCES } from './config/env';
import fetch from 'node-fetch';

const tasks = loadTasksFromConfig();
waitForDatabase(async () => {
  await uriGenerator.init();

  /** Schedule cron job */
  const cronFrequency = process.env.CRON_PATTERN || '0 0 2 * * *';
  new CronJob(cronFrequency, function() {
    console.log(`Data conversion triggered by cron job at ${new Date().toISOString()}`);
    fetch('http://localhost/conversion-tasks', { method: 'POST', body: null });
  }, null, true);

  app.post('/conversion-tasks', function(req, res, next) {
    convert(); // don't await the conversion
    return res.status(202).send();
  });

  app.use(errorHandler);

  if (RUN_ON_STARTUP) {
    convert(uriGenerator);
  }
});

// Helpers
async function convert() {
  try {
    if (LOAD_EXTERNAL_SQL_SOURCES) {
      await loadSources(tasks);
    }

    const results = [];
    console.log('Start data conversion');
    for (const task of tasks) {
      const result = await task.execute();
      console.log(`Finished conversion ${result.title} (${result.count} records)`);
      results.push(result);
    }

    console.log('\nConversion summary:');
    results.forEach((result) => {
      console.log(`- ${result.title}: ${result.count} records (source: ${result.source})`);
    });

    console.log('\nPublishing generated data');
    await publish(tasks);

    console.log(`\nFinished data conversion`);
  } catch(e) {
    console.error('Something went wrong during the conversion');
    console.error(e.message || e);
    console.trace(e);
  }
};
