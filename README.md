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
### Mounted volumes
The volume containing the input CSV files are mounted in `/input`.

The resulting file is written in `/ouput`. The volume mounted here must be the same volume as mounted in the [file-service](https://github.com/mu-semtech/file-service) if files must be downloadable by the end user.
### Environment variables
The following environment variables can be configured:
* `CRON_PATTERN` (default: `0 0 2 * * *`): [cron pattern](https://www.npmjs.com/package/cron#available-cron-patterns) defining when the data conversion is triggered
