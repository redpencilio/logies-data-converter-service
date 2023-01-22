const MAPPED_DATA_GRAPH = 'http://mu.semte.ch/graphs/mapped';
const PUBLIC_GRAPH = 'http://mu.semte.ch/graphs/public';
const HOST_DOMAIN = 'https://linked.toerismevlaanderen.be';

const DCAT_CATALOG = 'http://linked.toerismevlaanderen.be/id/catalogs/c62b30ce-7486-4199-a177-def7e1772a53';
const DCAT_DATASET_TYPE = 'http://linked.toerismevlaanderen.be/id/dataset-types/ca82a1e3-8a7c-438e-ba37-cf36063ba060';

const INPUT_DIRECTORY = process.env.INPUT_DIRECTORY || '/input';
const OUTPUT_DIRECTORY = process.env.OUTPUT_DIRECTORY || '/share';

const DIRECT_SPARQL_ENDPOINT = process.env.DIRECT_SPARQL_ENDPOINT || 'http://triplestore:8890/sparql';
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '1000');
const NB_OF_QUERY_RETRIES = 6;
const RETRY_TIMEOUT_MS = parseInt(process.env.RETRY_TIMEOUT_MS || '1000');
const LOG_DIRECT_QUERIES = isTruthy(process.env.LOG_DIRECT_QUERIES);

function isTruthy(value) {
  return [true, 'true', 1, '1', 'yes', 'Y', 'on'].includes(value);
}

export {
  MAPPED_DATA_GRAPH,
  PUBLIC_GRAPH,
  HOST_DOMAIN,
  DCAT_CATALOG,
  DCAT_DATASET_TYPE,
  INPUT_DIRECTORY,
  OUTPUT_DIRECTORY,
  DIRECT_SPARQL_ENDPOINT,
  BATCH_SIZE,
  NB_OF_QUERY_RETRIES,
  RETRY_TIMEOUT_MS,
  LOG_DIRECT_QUERIES
}
