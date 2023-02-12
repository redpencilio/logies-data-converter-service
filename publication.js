import { uuid, sparqlEscapeUri, sparqlEscapeDateTime } from 'mu';
import { querySudo as query, updateSudo as update } from '@lblod/mu-auth-sudo';
import concat from 'concat';
import fs from 'fs-extra';
import { DCAT_CATALOG, DCAT_DATASET_TYPE, PUBLIC_GRAPH, MAPPED_PUBLIC_GRAPH, MAPPED_PRIVATE_GRAPH, HOST_DOMAIN, OUTPUT_DIRECTORY, PUBLICATION_DIRECTORY } from './config/env';
import uriGenerator from './helpers/uri-helpers';
import { insertTriplesFromTtl } from './helpers/ttl-helpers';
import { copyGraph, removeDiff, removeDuplicates, removeGraph } from './helpers/graph-helpers';

async function publish(tasks) {
  const publicationFileId = uuid();
  const tmpGraphId = uuid();
  const graphs = {
    private: {
      target: MAPPED_PRIVATE_GRAPH
    },
    public: {
      target: MAPPED_PUBLIC_GRAPH
    }
  };

  for (const scope of Object.keys(graphs)) {
    graphs[scope].file = `${OUTPUT_DIRECTORY}/${publicationFileId}-${scope}.ttl`;

    // Concatenating output of all tasks in 1 file
    const taskOutputs = tasks.map((task) => task[`${scope}OutputFile`]);
    await concat(taskOutputs, graphs[scope].file);

    // Insert mapped data in tmp graph
    graphs[scope]['source'] = `http://mu.semte.ch/graphs/tmp/${tmpGraphId}/${scope}`;
    await insertTriplesFromTtl(graphs[scope].file, graphs[scope].source);

    // Remove tmp task output files
    Promise.all(taskOutputs.map(file => fs.remove(file)));
  }

  // Remove all triples from private that are also public
  await removeDuplicates(graphs.public.source, graphs.private.source);

  for (const scope of Object.keys(graphs)) {
    // Cleanup already published data
    // Remove all triples from target graph that aren't part of the mapping output anymore
    await removeDiff(graphs[scope].source, graphs[scope].target);

    // Publish new data
    await copyGraph(graphs[scope].source, graphs[scope].target);

    // Remove tmp graph
    console.log(`Cleanup tmp graph ${graphs[scope].source}`);
    await removeGraph(graphs[scope].source);
  }

  // Publish public data as dataset
  const publicationFile = `${PUBLICATION_DIRECTORY}/${publicationFileId}.ttl`;
  await fs.move(graphs.public.file, publicationFile);
  await publishDataset(publicationFileId);

  // Remove concatenated private file
  await fs.remove(graphs.private.file);
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
