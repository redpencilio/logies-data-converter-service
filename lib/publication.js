import { update, uuid, sparqlEscapeDateTime } from 'mu';
import os from 'os';
import postProcessQuery from '../sparql-queries/post-processing';
import { generateDataDumpUri, generateFileUri } from './uri-helpers';

const publish = async function(fileUuid) {
  await loadInStore(fileUuid);
  await restoreStaticData();
  await update(postProcessQuery);
  await publishDataDump(fileUuid);
};

const loadInStore = async function(fileUuid) {
  const tmpGraph = `http://importer-service/${uuid()}`;

  await update(`LOAD <http://${os.hostname()}/${fileUuid}.ttl> INTO GRAPH <${tmpGraph}>`);
  console.log(`Logies data has been written to <${tmpGraph}>`);

  await update(`MOVE <${tmpGraph}> TO <${process.env.MU_APPLICATION_GRAPH}>`);
  console.log(`Moved logies data to <${process.env.MU_APPLICATION_GRAPH}>`);
};

const staticFiles = [
  'faciliteiten',
  'registratie-logies-type',
  'registratie-status',
  'regorg-toerisme-vlaanderen',
  'toeristische-regios'
];

const restoreStaticData = async function() {
  for (let i = 0; i < staticFiles.length; i++) {
    const file = staticFiles[i];
    await update(`LOAD <http://${os.hostname()}/${file}.ttl> INTO GRAPH <${process.env.MU_APPLICATION_GRAPH}>`);
  }
};

const publishDataDump = async function(fileUuid) {
  const uploadResourceUuid = uuid();
  const uploadResourceUri = generateFileUri(uploadResourceUuid);
  const dataDumpUuid = uuid();
  const dataDumpUri = generateDataDumpUri(dataDumpUuid);
  const now = new Date();

  await update(`
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
    PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
    PREFIX dbpedia: <http://dbpedia.org/resource/>

    INSERT DATA {
      GRAPH <${process.env.MU_APPLICATION_GRAPH}> {
        <${dataDumpUri}> a ext:DataDump ;
          mu:uuid "${dataDumpUuid}" ;
          dct:title "Logies" ;
          dct:description "Informatie over logies in Vlaanderen" ;
          dct:created ${sparqlEscapeDateTime(now)} ;
          dct:modified ${sparqlEscapeDateTime(now)} ;
          nie:hasPart <${uploadResourceUri}> .
        <${uploadResourceUri}> a nfo:FileDataObject ;
          mu:uuid "${uploadResourceUuid}" ;
          nfo:fileName 'logies.ttl' ;
          dct:format "application/x-turtle" ;
          dbpedia:fileExtension "ttl" ;
          dct:created ${sparqlEscapeDateTime(now)} ;
          dct:modified ${sparqlEscapeDateTime(now)} .
        <share://${fileUuid}.ttl> a nfo:FileDataObject ;
          mu:uuid "${fileUuid}" ;
          nie:dataSource <${uploadResourceUri}> ;
          nfo:fileName "${fileUuid}.ttl" ;
          dct:format "application/x-turtle" ;
          dbpedia:fileExtension "ttl" ;
          dct:created ${sparqlEscapeDateTime(now)} ;
          dct:modified ${sparqlEscapeDateTime(now)} .
      }
    }`);
};

export default publish;
