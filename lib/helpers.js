import { lit } from 'rdflib';
import { ttlPrefixes } from './prefixes';
import { generator as uriGenerator } from './uri-helpers';
import { XSD } from './mappers/prefixes';

function toTtl(statements) {
  console.log(`Mapped ${statements.length} rows`);
  const data = statements.join('');
  const ttl = `${ttlPrefixes}\n${data}`;
  return ttl;
};

function hasAnyProp(record, properties) {
  return properties.find((prop) => record[prop] != null) != null;
}

function hasEveryProp(record, properties) {
  return properties.every((prop) => record[prop] != null);
}

function litDateTime(date) {
  return lit(date.toISOString(), undefined, XSD('dateTime'));
}

function isValidURL(value) {
  try {
    const url = new URL(value);
    return true;
  } catch (e) {
    return false;
  }
}

export {
  toTtl,
  uriGenerator,
  hasAnyProp,
  hasEveryProp,
  litDateTime,
  isValidURL
};
