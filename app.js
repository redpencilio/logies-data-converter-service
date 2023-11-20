import { CronJob } from 'cron';
import { app, errorHandler } from 'mu';
import fs from 'fs-extra';
import loadSources from './data-sources';
import publish from './publication';
import { loadTasksFromConfig, RecordTask } from './task';
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

  /* Run all conversion tasks for a record with the given ID */
  app.post('/records/:id/conversion-tasks', async (req, res, next) => {
    const recordId = req.params.id;

    for (const task of tasks) {
      const recordTask = new RecordTask(task, recordId);
      await recordTask.execute();
    }

    return res.status(204).send();
  });

  /* Run the conversion task with the given title for a record with the given ID */
  app.post('/conversion-tasks/:title/:id', async (req, res, next) => {
    const title = req.params.title;
    const recordId = req.params.id;

    const task = tasks.find((task) => task.title == title);

    if (task) {
      const recordTask = new RecordTask(task, recordId);
      await recordTask.execute();
      return res.status(204).send();
    } else {
      const error = new Error(`No task found with title '${title}'`);
      error.status = 404;
      return next(error);
    }
  });

  /* Run the conversion task with the given title */
  app.post('/conversion-tasks/:title', async (req, res, next) => {
    const title = req.params.title;
    const task = tasks.find((task) => task.title == title);

    if (task) {
      task.execute().then((result) => {
        console.log(`Finished conversion ${result.title} (${result.count} records)`);
      });
      return res.status(202).send();
    } else {
      const error = new Error(`No task found with title '${title}'`);
      error.status = 404;
      return next(error);
    }
  });

  /* Run all conversion tasks */
  app.post('/conversion-tasks', function(req, res, next) {
    convert(); // don't await the conversion
    return res.status(202).send();
  });

  /* Load the input sources to files */
  app.post('/load-sources', async (req, res, next) => {
    try {
      loadSources(tasks);
      return res.status(202).send();
    } catch(e) {
      console.error('Something went wrong when loading the sources');
      console.error(e.message || e);
      console.trace(e);
    }
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
