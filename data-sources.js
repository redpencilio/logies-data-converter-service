import fs from 'fs-extra';
import sql from 'mssql';

import {
  SQL_USER,
  SQL_PASSWORD,
  SQL_SERVER,
  SQL_DATABASE,
  SQL_PORT,
  SQL_BATCH_SIZE
} from './config/env';

const config = {
  user: SQL_USER,
  password: SQL_PASSWORD,
  server: SQL_SERVER,
  database: SQL_DATABASE,
  port: SQL_PORT
};

const executeBatchedSqlQuery = async function(query, sqlpool) {
  try {
    let records = [];
    let resultLength = SQL_BATCH_SIZE;
    let offset = 0;
    let loop = 1;

    while(resultLength == SQL_BATCH_SIZE) {
      const sql = `${query} OFFSET ${offset} ROWS FETCH NEXT ${SQL_BATCH_SIZE} ROWS ONLY OPTION (RECOMPILE);`;
      let result = await sqlpool.request().query(sql);
      console.log(`Batch number ${loop} including ${result.rowsAffected} rows`);

      records = records.concat(result.recordset);

      offset += SQL_BATCH_SIZE;
      loop += 1;
      resultLength = result.rowsAffected;
    }

    return records;
  } catch (err) {
    console.log(`An error has occured: ${err}`);
    return [];
  }
};

const loadSource = async function(pool, query, file) {
  const records = await executeBatchedSqlQuery(query, pool);
  console.log(`Writing ${records.length} records to file ${file}`);
  const data = JSON.stringify(records);
  await fs.writeFile(file, data, { encoding: 'utf8' });
};

const loadSources = async function(tasks) {
  console.log(`Loading sources...`);
  try {
    const pool = await sql.connect(config);
    const queryEngine = async function(query, file) {
      await loadSource(pool, query, file);
    };
    for (const task of tasks) {
      await task.load(queryEngine);
    };
  } finally {
    sql.close();
  }
};

export default loadSources;
