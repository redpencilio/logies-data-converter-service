import { sym, lit, Statement } from 'rdflib';
import { uriGenerator } from '../helpers';
import { tvlOrganizationUri } from '../codelists';
import { LOGIES, MU, RDF, SCHEMA } from './prefixes';

function mapProductDescriptions(recordId, record, lang) {
  const descriptions = [
    'product_description',
    'description'
  ].map((field) => mapProductDescription(recordId, record, lang, field));

  return descriptions.filter((d) => d); // remove null values
}

function mapAccessibilityDescription(recordId, record, lang) {
  return mapProductDescription(recordId, record, lang, 'accessibility_description');
}

function mapProductDescription(recordId, record, lang, field) {
  if (record[field]) {
    const { uuid, uri } = uriGenerator.description(recordId);
    const statements = [
      new Statement(sym(uri), RDF('type'), LOGIES('Beschrijving')),
      new Statement(sym(uri), MU('uuid'), lit(uuid)),
      new Statement(sym(uri), SCHEMA('value'), lit(record[field], lang)),
    ];

    return { uri, statements };
  } else {
    return null;
  }
}

export {
  mapProductDescriptions,
  mapAccessibilityDescription
}
