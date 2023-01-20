import fs from 'fs-extra';
import sql from 'mssql';

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const server = process.env.DB_SERVER || 'sqldb';
const database = process.env.DB_NAME;
const port = process.env.DB_PORT || 1433;
const batchSize = parseInt(process.env.BATCH_SIZE) || 10000;

const config = {
  user,
  password,
  server,
  database,
  port
};

const executeBatchedSqlQuery = async function(query, sqlpool) {
  try {
    let records = [];
    let resultLength = batchSize;
    let offset = 0;
    let loop = 1;

    while(resultLength == batchSize) {
      const sql = `${query} OFFSET ${offset} ROWS FETCH NEXT ${batchSize} ROWS ONLY OPTION (RECOMPILE);`;
      let result = await sqlpool.request().query(sql);
      console.log(`Batch number ${loop} including ${result.rowsAffected} rows`);

      records = records.concat(result.recordset);

      offset += batchSize;
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
