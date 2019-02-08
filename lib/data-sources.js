import fs from 'fs-extra';
import requestPromise from 'request-promise';

const loadSources = async function(tasks) {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    console.log(`Downloading ${task.title}`);
    const data = await requestPromise(task.url);
    await fs.writeFile(task.inputFile, data, { encoding: 'utf8' });
    console.log(`Finished downloading ${task.title}`);
  };
};

export default loadSources;
