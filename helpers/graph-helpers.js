import { querySudo, updateSudo } from '@lblod/mu-auth-sudo';
import { queryTriplestore, updateTriplestore } from './triplestore';
import { BATCH_SIZE } from '../config/env';

/*
 * Copy all triples from source graph that don't exist in target graph yet
*/
async function copyGraph(source, target, useDirect = false) {
  const query = useDirect ? queryTriplestore : querySudo;
  const update = useDirect ? updateTriplestore : updateSudo;

  const queryResult = await query(`
    SELECT (COUNT(*) as ?count) WHERE {
      GRAPH <${source}> { ?s ?p ?o . }
      FILTER NOT EXISTS {
        GRAPH <${target}> { ?s ?p ?o . }
      }
    }`);

  const count = parseInt(queryResult.results.bindings[0].count.value);
  console.log(`${count} triples in graph <${source}> not found in target graph <${target}>. Going to copy these triples.`);
  const limit = BATCH_SIZE;
  const totalBatches = Math.ceil(count / limit);
  console.log(`Copying ${count} triples in batches of ${BATCH_SIZE}`);

  let currentBatch = 0;
  while (currentBatch < totalBatches) {
    // Note: no OFFSET needed in the subquery. Pagination is inherent since
    // the WHERE clause doesn't match any longer for triples that are copied
    // in the previous batch.
    console.log(`Inserting batch ${currentBatch}/${totalBatches}`);
    await update(`
      INSERT {
        GRAPH <${target}> {
          ?s ?p ?o .
        }
      } WHERE {
        SELECT ?s ?p ?o WHERE {
          GRAPH <${source}> { ?s ?p ?o . }
          FILTER NOT EXISTS {
            GRAPH <${target}> { ?s ?p ?o . }
          }
        } LIMIT ${limit}
      }`);
    currentBatch++;
  }
}

/*
 * Removes all triples from target graph that don't exist in source graph
*/
async function removeDiff(source, target, useDirect = false) {
  const query = useDirect ? queryTriplestore : querySudo;
  const update = useDirect ? updateTriplestore : updateSudo;

  const queryResult = await query(`
    SELECT (COUNT(*) as ?count) WHERE {
      GRAPH <${target}> { ?s ?p ?o . }
      FILTER NOT EXISTS {
        GRAPH <${source}> { ?s ?p ?o . }
      }
    }`);

  const count = parseInt(queryResult.results.bindings[0].count.value);
  console.log(`${count} triples in graph <${target}> not found in source graph <${source}>. Going to remove these triples.`);
  const limit = BATCH_SIZE;
  const totalBatches = Math.ceil(count / limit);
  console.log(`Removing ${count} triples in batches of ${BATCH_SIZE}`);

  let currentBatch = 0;
  while (currentBatch < totalBatches) {
    // Note: no OFFSET needed in the subquery. Pagination is inherent since
    // the WHERE clause doesn't match any longer for triples that are removed
    // in the previous batch.
    console.log(`Removing batch ${currentBatch}/${totalBatches}`);
    await update(`
      DELETE {
        GRAPH <${target}> {
          ?s ?p ?o .
        }
      } WHERE {
        SELECT ?s ?p ?o WHERE {
          GRAPH <${target}> { ?s ?p ?o . }
          FILTER NOT EXISTS {
            GRAPH <${source}> { ?s ?p ?o . }
          }
        } LIMIT ${limit}
      }`);
    currentBatch++;
  }
}

/*
 * Removes all triples from target graph that are also in source graph
*/
async function removeDuplicates(source, target, useDirect = false) {
  const query = useDirect ? queryTriplestore : querySudo;
  const update = useDirect ? updateTriplestore : updateSudo;

  const queryResult = await query(`
    SELECT (COUNT(*) as ?count) WHERE {
      GRAPH <${source}> { ?s ?p ?o . }
      GRAPH <${target}> { ?s ?p ?o . }
      FILTER (<${source}> != <${target}>)
    }`);

  const count = parseInt(queryResult.results.bindings[0].count.value);
  console.log(`${count} triples in graph <${target}> also found in source graph <${source}>. Going to remove these triples.`);
  const limit = BATCH_SIZE;
  const totalBatches = Math.ceil(count / limit);
  console.log(`Removing ${count} triples in batches of ${BATCH_SIZE}`);

  let currentBatch = 0;
  while (currentBatch < totalBatches) {
    // Note: no OFFSET needed in the subquery. Pagination is inherent since
    // the WHERE clause doesn't match any longer for triples that are removed
    // in the previous batch.
    await update(`
      DELETE {
        GRAPH <${target}> {
          ?s ?p ?o .
        }
      } WHERE {
        SELECT (COUNT(*) as ?count) WHERE {
          GRAPH <${source}> { ?s ?p ?o . }
          GRAPH <${target}> { ?s ?p ?o . }
          FILTER (<${source}> != <${target}>)
        } LIMIT ${limit}
      }`);
    currentBatch++;
  }
}

async function removeGraph(graph, useDirect = false) {
  const query = useDirect ? queryTriplestore : querySudo;
  const update = useDirect ? updateTriplestore : updateSudo;

  const count = await countTriples(graph, useDirect);
  if (count > 0) {
    console.log(`Deleting 0/${count} triples`);
    let offset = 0;
    const deleteStatement = `
      DELETE {
        GRAPH <${graph}> {
          ?subject ?predicate ?object .
        }
      }
      WHERE {
        GRAPH <${graph}> {
          SELECT ?subject ?predicate ?object
            WHERE { ?subject ?predicate ?object }
            LIMIT ${BATCH_SIZE}
        }
      }
    `;

    while (offset < count) {
      console.log(`Deleting triples in batch: ${offset}-${offset + BATCH_SIZE}`);
      await update(deleteStatement);
      offset = offset + BATCH_SIZE;
    }
  }
}

async function countTriples(graph, useDirect = false) {
  const query = useDirect ? queryTriplestore : querySudo;

  const queryResult = await query(`
        SELECT (COUNT(*) as ?count)
        WHERE {
          GRAPH <${graph}> {
            ?s ?p ?o .
          }
        }
      `);

  return parseInt(queryResult.results.bindings[0].count.value);
}

export {
  copyGraph,
  removeDiff,
  removeDuplicates,
  removeGraph
}
