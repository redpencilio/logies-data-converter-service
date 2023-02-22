import fs from 'fs-extra';
import chunk from 'lodash.chunk';
import tasks from './config/tasks';
import { INPUT_DIRECTORY, OUTPUT_DIRECTORY, RECORDS_CHUNK_SIZE } from './config/env';

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
  static async logError(title,error){
    const otfl = `${OUTPUT_DIRECTORY}/${title}-errors.txt`;
    let er = error +'\n';
    await fs.appendFile(otfl,er);

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

  get publicOutputFile() {
    return `${OUTPUT_DIRECTORY}/${this.title}-public.ttl`;
  }

  get privateOutputFile() {
    return `${OUTPUT_DIRECTORY}/${this.title}-private.ttl`;
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

    // Cleanup possible dirty state from previous run
    await fs.remove(this.publicOutputFile);
    await fs.remove(this.privateOutputFile);

    // Parse input files
    const input = await fs.readFile(this.inputFile, 'utf8');
    const records = JSON.parse(input);
    const translations = await Promise.all(
      this.translations.map(async (translation) => {
        const translationInput = await fs.readFile(translation.inputFile, 'utf8');
        const translationRecords = JSON.parse(translationInput);
        return { lang: translation.lang, records: translationRecords };
      })
    );

    // Map records in batches
    const batches = chunk(records, RECORDS_CHUNK_SIZE);
    console.log(`Split task into ${batches.length} chunks of ${RECORDS_CHUNK_SIZE} records`);
    let i = 0;
    for (const batch of batches) {
      i++;
      const [publicGraph, privateGraph] = this.mapper(batch, translations,er => Task.logError(this.title,er));

      await fs.appendFile(this.publicOutputFile, publicGraph.toNT());
      await fs.appendFile(this.privateOutputFile, privateGraph.toNT());

      console.log(`Mapped ${Math.min(i * RECORDS_CHUNK_SIZE, records.length)}/${records.length} records`);
    }

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
