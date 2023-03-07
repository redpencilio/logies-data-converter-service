FROM semtech/mu-javascript-template:1.6.0
LABEL maintainer=info@redpencil.io

ENV LOAD_EXTERNAL_SQL_SOURCES "true"
ENV DEBUG_AUTH_HEADERS "false"
ENV LOG_SPARQL_ALL "false"
