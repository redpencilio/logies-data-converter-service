import { lit } from 'rdflib';
import { XSD } from '../mappers/prefixes';

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
  hasAnyProp,
  hasEveryProp,
  litDateTime,
  isValidURL
};
