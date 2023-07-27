# logies-data-conversion-service
Microservice to transform the touristic data of Toerisme Vlaanderen to the semantic Logies model as described by the [Logies Basis application profile](https://data.vlaanderen.be/doc/applicatieprofiel/logies-basis/) and load it in a triple store. It also publishes a DCAT dataset.

## Getting started
### Add the service to your stack
To add the service to your stack, add the following snippet to `docker-compose.yml`:

```
services:
  import:
    image: redpencil/logies-data-converter-service:1.2.0
    volumes:
      - ./data/input:/input
      - ./data/output:/output
      - ./data/files:/share
```

`/input` contains the input data for the mapping.

`/output` contains intermediate files generated during the mapping. They will be removed at the end of the process.

`/share` contains the TTL files that are published as DCAT dataset. The volume mounted here must be the same volume as mounted in the [file-service](https://github.com/mu-semtech/file-service) if files must be downloadable by the end user.

## Reference
### Configuration
#### Tasks
The conversion tasks are configured in `./config/tasks.js`. 

* `enabled`: boolean flag whether task is enabled
* `title`: title of the task used to construct file names
* `query`: SQL query to fetch the input data
* `mapper`: function to use for mapping
* `translations` (optional): additional translations to be mapped. The translations object has the following properties:
  * `query`: function generating the SQL query to fetch the translations data. The function gets the language as parameter.
  * `languages`: array of languages to map

#### Environment variables
The following environment variables can be configured:
* `CRON_PATTERN` (default: `0 0 2 * * *`): [cron pattern](https://www.npmjs.com/package/cron#available-cron-patterns) defining when the data conversion is triggered

* `SQL_USER` : username for the SQL database
* `SQL_PASSWORD` : password for the SQL database 
* `SQL_SERVER` (default `sqldb`) : hostname of the SQL server
* `SQL_DATABASE` : name of the SQL database
* `SQL_PORT` (default 1143): port to connect to the SQL database
* `SQL_BATCH_SIZE` (default 10000) : page size to fetch data from SQL database

* `MAPPED_PUBLIC_GRAPH` (default http://mu.semte.ch/graphs/mapped/public) : graph to write public mapped data to
* `MAPPED_PRIVATE_GRAPH_BASE` (default http://mu.semte.ch/graphs/mapped/private/) : base URI of the graphs to write private mapped data to
* `PUBLIC_GRAPH` (default http://mu.semte.ch/graphs/public) : graph containing public static data
* `HOST_DOMAIN` (default https://linked.toerismevlaanderen.be) : host domain used as base to generate resource URIs

* `DCAT_CATALOG` (default http://linked.toerismevlaanderen.be/id/catalogs/c62b30ce-7486-4199-a177-def7e1772a53) : URI of the Toerisme Vlaanderen DCAT catalog
* `DCAT_DATASET_TYPE` (default http://linked.toerismevlaanderen.be/id/dataset-types/ca82a1e3-8a7c-438e-ba37-cf36063ba060) : URI of the tourist attractions dataset type 

* `INPUT_DIRECTORY` (default `/input`) : directory to write input files with SQL data to
* `OUTPUT_DIRECTORY` (default `/output`) : directory to write intermediate files to. They will be removed once the mapping has been finished.
* `PUBLICATION_DIRECTORY` (default `/share`) : directy to write dataset TTL files to

* `RUN_ON_STARTUP` (default `false`) : whether conversion must be trigered on startup
* `LOAD_EXTERNAL_SQL_SOURCES` (default `true`) : whether input data must be fetched from SQL database. Can be disabled during development when input files are already provided in `INPUT_DIRECTORY`.

* `BATCH_SIZE` (default 1000) : batch size to use in update SPARQL queries
* `RETRY_TIMEOUT_MS` (default 1000) : number of milliseconds between to SPARQL query retries
* `RECORDS_CHUNK_SIZE` (default 1000) : number of records to map in 1 batch. Intermediate results are written to a TTL file.
* `DIRECT_SPARQL_ENDPOINT` (default `http://triplestore:8890/sparql`): endpoint to execute SPARQL queries directly on Virtuoso instead of via mu-authorization. Typically used for data operations on tmp graphs.

### Conversion process
The conversion process consists of the following steps:

For each task configured in `./config/tasks.js`:
1. Fetch input data from the SQL database and write to a JSON file
2. Convert the JSON records to triple statements, grouped in graphs
3. Write the triples to TTL files per graph

Once all tasks are executed:
1. TTL files of the several tasks are merged per graph
2. Load data in a temporary graph in the triplestore
3. Update published data in the `http://mu.semte.ch/graphs/mapped/...` graphs based on the data in the temporary graph
4. Remove data from the temporary graph
5. Publish a DCAT dataset

### URI generation
For each Linked Data resource a URI and random uuid gets generated. To ensure stable URIs across conversion processes, identifiers of the SQL database are mapped on the Linked Data URIs. The mapping is stored in the `http://mu.semte.ch/graphs/uri-mapping` graph as follows:

```
<resource> <http://mu.semte.ch/vocabularies/hasUuid> <generated-mu-uuid> ; 
    <http://mu.semte.ch/vocabularies/hasTvlId> <generated-hash-based-on-SQL-id> .
```

On startup of the service, the mappings are loaded in memory to improve lookup performance during the conversion process.
