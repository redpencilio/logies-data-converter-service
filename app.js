import { CronJob } from 'cron';
import { app, errorHandler } from 'mu';
import fs from 'fs-extra';
import request from 'request';
import loadSources from './data-sources';
import publish from './publication';
import { loadTasksFromConfig } from './task';
import { RUN_ON_STARTUP } from './config/env';

const tasks = loadTasksFromConfig();

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


// Helpers

const convert = async function() {
  try {
    await loadSources(tasks);

    const results = [];
    console.log('Start mapping');
    for (const task of tasks) {
      const result = await task.execute();
      console.log(`Finished mapping ${result.title} (${result.count} records)`);
      results.push(result);
    }

    console.log('\nMapping summary:');
    results.forEach((result) => {
      console.log(`- ${result.title}: ${result.count} records (source: ${result.source})`);
    });

    console.log('\nPublishing generated data');
    await publish(tasks);

    console.log(`\nFinished data mapping`);
  } catch(e) {
    console.error('Something went wrong during the conversion');
    console.error(e.message || e);
    console.trace(e);
  }
};

if (RUN_ON_STARTUP) {
  convert();
}
