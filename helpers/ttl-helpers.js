import { Parser } from 'n3';
import { createReadStream } from 'node:fs';
import { sparqlEscapeString, sparqlEscapeUri } from 'mu';
import { BATCH_SIZE } from '../config/env';
import { updateTriplestore } from './triplestore';

async function parseTtl(stream) {
  return (new Promise((resolve, reject) => {
    const parser = new Parser();
    const triples = [];
    parser.parse(stream, (error, triple) => {
      if (error) {
        reject(error);
      } else if (triple) {
        triples.push(triple);
      } else {
        resolve(triples);
      }
    });
  }));
}

async function insertTriplesFromTtl(ttlFile, graph) {
  const ttlStream = createReadStream(ttlFile, { flag: 'r', encoding: 'utf8' });
  const triples = await parseTtl(ttlStream);
  ttlStream.close();
  const statements = triples.map(triple => toTripleStatement(triple));
  await insertStatements(statements, graph);
}

async function insertStatements(statements, graph) {
  console.log(`Inserting ${statements.length} triples in graph <${graph}>`);
  for (let i = 0; i < statements.length; i += BATCH_SIZE) {
    console.log(`Inserting statements in batch: ${i}-${i + BATCH_SIZE}`);
    const batch = statements.slice(i, i + BATCH_SIZE).join('\n');
    await updateTriplestore(`
      INSERT DATA {
        GRAPH <${graph}> {
            ${batch}
        }
      }
    `);
  }
}

function toTripleStatement(triple) {
  const escape = function (node) {
    const { termType, value, datatype, language } = node;
    if (termType == "NamedNode") {
      return sparqlEscapeUri(value);
    } else if (termType == "Literal") {
      // We ignore xsd:string datatypes because Virtuoso doesn't treat those as default datatype
      // Eg. SELECT * WHERE { ?s mu:uuid "4983948" } will not return any value if the uuid is a typed literal
      if (language)
        return `${sparqlEscapeString(value)}@${language}`;
      else if (datatype && datatype.value && datatype.value != 'http://www.w3.org/2001/XMLSchema#string')
        return `${sparqlEscapeString(value)}^^${sparqlEscapeUri(datatype.value)}`;
      else
        return `${sparqlEscapeString(value)}`;
    } else
      console.log(`Don't know how to escape type ${termType}. Will escape as a string.`);
    return sparqlEscapeString(value);
  };

  const subject = escape(triple['subject']);
  const predicate = escape(triple['predicate']);
  const object = escape(triple['object']);

  return `${subject} ${predicate} ${object} .`;
}

export {
  parseTtl,
  insertTriplesFromTtl
};
