import fs from 'fs-extra';
import requestPromise from 'request-promise';

const loadSources = async function(tasks) {
  const promises = tasks.map(async function(task) {
    console.log(`Downloading ${task.title}`);
    const data = await requestPromise(task.url);
    await fs.writeFile(task.inputFile, data, { encoding: 'utf8' });
    console.log(`Finished downloading ${task.title}`);
  });

  return Promise.all(promises);
};

export default loadSources;
