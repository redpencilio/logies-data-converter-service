import { uuid, sparqlEscapeUri, sparqlEscapeDateTime } from 'mu';
import { querySudo as query, updateSudo as update } from '@lblod/mu-auth-sudo';
import concat from 'concat';
import fs from 'fs-extra';
import { DCAT_CATALOG, DCAT_DATASET_TYPE, PUBLIC_GRAPH, MAPPED_DATA_GRAPH, HOST_DOMAIN, OUTPUT_DIRECTORY } from '../config/env';
import { uriGenerator } from './helpers';
import { insertTriplesFromTtl } from './ttl-helpers';
import { copyGraph, removeDiff } from './graph-helpers';
import { updateTriplestore } from './triplestore';

async function publish(tasks) {
  // Concatenating output of all tasks in 1 file
  const taskOutputs = tasks.map((task) => task.outputFile);
  const outputFileId = uuid();
  const outputFile = `${OUTPUT_DIRECTORY}/${outputFileId}.ttl`;
  await concat(taskOutputs, outputFile);

  // Insert mapped data in tmp graph
  const tmpGraph = `http://mu.semte.ch/graphs/tmp/${uuid()}`;
  await insertTriplesFromTtl(outputFile, tmpGraph);

  // Cleanup already published data
  // Remove all triples from target graph that aren't part of the mapping output anymore
  await removeDiff(tmpGraph, MAPPED_DATA_GRAPH);

  // Publish new data
  await copyGraph(tmpGraph, MAPPED_DATA_GRAPH);

  // Publish dataset
  await publishDataset(outputFileId);

  // Remove tmp graph
  await updateTriplestore(`DROP SILENT GRAPH <${tmpGraph}>`);

  // Remove tmp task output files
  Promise.all(taskOutputs.map(file => fs.remove(file)));
}

async function publishDataset(physicalFileUuid) {
  const { fileUuid, fileUri } = uriGenerator.file(uuid());
  const { datasetUuid, datasetUri } = uriGenerator.dataset(uuid());
  const now = new Date();

  // Find previous dataset version and remove physical file
  const result = await query(`
    PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dct:  <http://purl.org/dc/terms/>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>

    SELECT ?dataset ?physicalFile
    WHERE {
      GRAPH <${PUBLIC_GRAPH}> {
        ?dataset a dcat:Dataset ;
          dct:type ${sparqlEscapeUri(DCAT_DATASET_TYPE)} ;
          dcat:distribution ?distribution .
        FILTER NOT EXISTS { ?newerVersion prov:wasRevisionOf ?dataset . }
        ?physicalFile nie:dataSource ?distribution .
      }
    } LIMIT 1
  `);

  if (result.results.bindings.length) {
    const binding = result.results.bindings[0];
    const previousDataset = binding['dataset'].value;
    console.log(`Found previous dataset <${previousDataset}>`);

    await update(`
      PREFIX prov: <http://www.w3.org/ns/prov#>

      INSERT DATA {
        GRAPH <${PUBLIC_GRAPH}> {
          <${datasetUri}> prov:wasRevisionOf <${previousDataset}> .
        }
      }
    `);
    await update(`
      PREFIX dcat: <http://www.w3.org/ns/dcat#>
      PREFIX dct:  <http://purl.org/dc/terms/>
      PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
      PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>

      DELETE {
        GRAPH <${PUBLIC_GRAPH}> {
          <${previousDataset}> dct:modified ?datasetModifiedDate .
          ?distribution dcat:downloadURL ?downloadURL ;
            dct:modified ?distributionModifiedDate .
          ?physicalFile a nfo:FileDataObject ;
            nie:dataSource ?distribution ;
            ?p ?o .
        }
      } WHERE {
        GRAPH <${PUBLIC_GRAPH}> {
          <${previousDataset}> dcat:distribution ?distribution ;
            dct:modified ?datasetModifiedDate .
          ?distribution dcat:downloadURL ?downloadURL ;
            dct:modified ?distributionModifiedDate .
          ?physicalFile a nfo:FileDataObject ;
            nie:dataSource ?distribution ;
            ?p ?o .
        }
      }`);

    const distributionFile = binding['physicalFile'].value.replace('share://', '/share/');
    await fs.remove(distributionFile);
  } else {
    console.log(`No previous dataset version found to unpublish`);
  }

  // Insert new dataset with a TTL distribution
  await update(`
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
    PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
    PREFIX dbpedia: <http://dbpedia.org/resource/>
    PREFIX dcat: <http://www.w3.org/ns/dcat#>

    INSERT DATA {
      GRAPH <${PUBLIC_GRAPH}> {
        <${datasetUri}> a dcat:Dataset ;
          mu:uuid "${datasetUuid}" ;
          dct:title "Toeristische attracties en logies" ;
          dct:description "Informatie over toeristische attracties en logies in Vlaanderen" ;
          dct:type ${sparqlEscapeUri(DCAT_DATASET_TYPE)} ;
          dct:created ${sparqlEscapeDateTime(now)} ;
          dct:modified ${sparqlEscapeDateTime(now)} ;
          dct:issued ${sparqlEscapeDateTime(now)} ;
          dcat:distribution <${fileUri}> .
        <${fileUri}> a nfo:FileDataObject, dcat:Distribution ;
          mu:uuid "${fileUuid}" ;
          nfo:fileName 'toeristische-attracties.ttl' ;
          dct:format "application/x-turtle" ;
          dbpedia:fileExtension "ttl" ;
          dcat:downloadURL <${HOST_DOMAIN}/files/${fileUuid}/download> ;
          dct:created ${sparqlEscapeDateTime(now)} ;
          dct:modified ${sparqlEscapeDateTime(now)} ;
          dct:issued ${sparqlEscapeDateTime(now)} .
        <share://${physicalFileUuid}.ttl> a nfo:FileDataObject ;
          mu:uuid "${physicalFileUuid}" ;
          nie:dataSource <${fileUri}> ;
          nfo:fileName "${physicalFileUuid}.ttl" ;
          dct:format "application/x-turtle" ;
          dbpedia:fileExtension "ttl" ;
          dct:created ${sparqlEscapeDateTime(now)} ;
          dct:modified ${sparqlEscapeDateTime(now)} .
      }
    }`);
};

export default publish;
