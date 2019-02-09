# logies-data-conversion-service
Microservice to transform the Logies data of Toerisme Vlaanderen to the semantic Logies model as described by the [Logies Basis application profile](https://data.vlaanderen.be/doc/applicatieprofiel/logies-basis/) and load it in a triple store. It also publishes a data dump.

## Installation
To add the service to your stack, add the following snippet to `docker-compose.yml`:

```
services:
  import:
    image: redpencilio/logies-data-conversion-service
    volumes:
      - ./data/input:/input
      - ./data/files:/output
```

## Configuration
### Input files
The input CSV files are downloaded from the Toerisme Vlaanderen Open Data Portal. The conversion tasks are configured in `/app/config/tasks`. Each tasks has the following properties:
* title: a human readable title of the task used for logging
* inputFile: path in the container to store the downloaded input file
* url: URL to download the input file from
* outputFile: path in the container to store the intermediate resulting TTL file
* mapper: function to use for mapping
### Output files
The resulting file is written in `/ouput`. The volume mounted here must be the same volume as mounted in the [file-service](https://github.com/mu-semtech/file-service) if files must be downloadable by the end user.
### Environment variables
The following environment variables can be configured:
* `CRON_PATTERN` (default: `0 0 2 * * *`): [cron pattern](https://www.npmjs.com/package/cron#available-cron-patterns) defining when the data conversion is triggered
* `OUTPUT_DIRECTORY` (default: `/output`): output directory to store the final TTL file
