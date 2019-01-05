# logies-data-conversion-service
Microservice to transform the Logies data of Toerisme Vlaanderen to the semantic Logies model as described by the [Logies Basis application profile](https://data.vlaanderen.be/doc/applicatieprofiel/logies-basis/).

## Installation
To add the service to your stack, add the following snippet to `docker-compose.yml`:

```
services:
  logies-conversion:
    image: redpencilio/logies-data-conversion-service
```
