import fs from 'fs-extra';
import tasks from './config/tasks';
import { INPUT_DIRECTORY, OUTPUT_DIRECTORY } from './config/env';

class Translation {
  constructor(lang, title, query) {
    this.lang = lang;
    this.title = title;
    this.query = query;
  }

  static parse(json) {
    const title = `${json.title}_translation_${json.lang}`;
    const query = json.query(json.lang);
    return new Translation(json.lang, title, query);
  }

  get inputFile() {
    return `${INPUT_DIRECTORY}/${this.title}.json`;
  }
}

class Task {
  constructor(title, query, mapper) {
    this.title = title;
    this.query = query;
    this.mapper = mapper || function() { return ''; };
    this.translations = [];
  }

  static parse(json) {
    const { title, query, mapper, translations } = json;
    const task = new Task(title, query, mapper);
    if (translations) {
      translations.languages.forEach((lang) => {
        const translation = Translation.parse({
          lang,
          title,
          query: translations.query
        });
        task.translations.push(translation);
      });
    }
    return task;
  }

  get inputFile() {
    return `${INPUT_DIRECTORY}/${this.title}.json`;
  }

  get outputFile() {
    return `${OUTPUT_DIRECTORY}/${this.title}.ttl`;
  }

  async load(queryEngine) {
    await queryEngine(this.query, this.inputFile);
    if (this.translations.length) {
      for (const translation of this.translations) {
        await queryEngine(translation.query, translation.inputFile);
      }
    }
    console.log(`Finished loading records of ${this.title}`);
  }

  async execute() {
    console.log(`Executing task: ${this.title}`);
    const input = await fs.readFile(this.inputFile, 'utf8');
    const records = JSON.parse(input);
    const translations = await Promise.all(
      this.translations.map(async (translation) => {
        const translationInput = await fs.readFile(translation.inputFile, 'utf8');
        const translationRecords = JSON.parse(translationInput);
        return { lang: translation.lang, records: translationRecords };
      })
    );
    const ttl = this.mapper(records, translations);
    await fs.outputFile(this.outputFile, ttl);

    return {
      title: this.title,
      source: this.inputFile,
      count: records.length
    };
  }
}

function loadTasksFromConfig() {
  return tasks
    .filter((task) => task.enabled)
    .map((task) => Task.parse(task));
}

export {
  loadTasksFromConfig
}
