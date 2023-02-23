import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { isValidURL, normalizeUrl } from '../helpers';
import { honorificPrefixes } from './codelists';
import { ADMS, FOAF, LOCN, MU, ORG, RDF, SCHEMA, SKOS, VCARD } from './prefixes';
import { mapAddress } from './address';

function mapContactPoints(recordId, record, errorLogger) {
  const channels = {
    'phone1': { predicate: SCHEMA('telephone') },
    'phone2': { predicate: SCHEMA('telephone') },
    'phone3': { predicate: SCHEMA('telephone') },
    'fax': { predicate: SCHEMA('faxNumber') },
    'email': { predicate: SCHEMA('email') },
    'website': { predicate: FOAF('page') },
    'facebook': { predicate: FOAF('page'), name: 'Facebook' },
    'instagram': { predicate: FOAF('page'), name: 'Instagram' },
    'flickr': { predicate: FOAF('page'), name: 'Flickr' },
    'twitter': { predicate: FOAF('page'), name: 'Twitter' },
    'link_to_accessibility_website': { predicate: FOAF('page'), name: 'Toegankelijkheidswebsite' },
  };

  const contactPoints = [];

  for (const channel in channels) {
    let value = record[channel] && record[channel].trim();

    if (value) {
      const url = normalizeUrl(value, channel);
      if (isValidURL(url)) {
        const { uuid, uri } = uriGenerator.contactPoint(recordId, channel);
        const { predicate, name } = channels[channel];
        const statements = [
          new Statement(sym(uri), RDF('type'), SCHEMA('ContactPoint')),
          new Statement(sym(uri), MU('uuid'), lit(uuid)),
          new Statement(sym(uri), predicate, sym(new URL(url).href))
        ];
        if (name) {
          statements.push(new Statement(sym(uri), FOAF('name'), lit(name)));
        }
        contactPoints.push({ uri, statements });
      } else {
        errorLogger(channel, value, recordId);
      }
    }
  };

  return contactPoints;
}

function mapProductOwner(recordId, record, errorLogger, postfix = '') {
  const orgId = record[`product_owner_contact_id${postfix}`];
  const { uuid, uri } = uriGenerator.organisation(orgId);

  let statements = [
    new Statement(sym(uri), RDF('type'), ORG('Organisation')),
    new Statement(sym(uri), MU('uuid'), lit(uuid)),
  ];

  if (record[`product_owner_company_name${postfix}`]) {
    statements.push(new Statement(sym(uri), SKOS('prefLabel'), lit(record[`product_owner_company_name${postfix}`], 'nl')));
  }

  if (record[`product_owner_company_identification${postfix}`]) {
    const { uuid: orgIdUuid, uri: orgIdUri } = uriGenerator.organisationIdentifier(orgId);
    statements = [
      new Statement(sym(orgIdUri), RDF('type'), ADMS('Identifier')),
      new Statement(sym(orgIdUri), MU('uuid'), lit(orgIdUuid)),
      new Statement(sym(orgIdUri), SKOS('notation'), lit(record[`product_owner_company_identification${postfix}`])),
      ...statements,
    ];
  }

  const { contactPointUuid, contactPointUri } = uriGenerator.contactPoint(orgId, 'organisation');
  let contactStatements = [];
  [
    { property: `product_owner_phone1${postfix}`, predicate: SCHEMA('telephone') },
    { property: `product_owner_phone2${postfix}`, predicate: SCHEMA('telephone') },
    { property: `product_owner_phone3${postfix}`, predicate: SCHEMA('telephone') },
    { property: `product_owner_email${postfix}`, predicate: SCHEMA('email') },
    { property: `product_owner_website${postfix}`, predicate: FOAF('page') },
  ].forEach((prop) => {
    if (record[prop.property]) {
      const url = normalizeUrl(record[prop.property], prop.property);
      if (isValidURL(url)) {
        contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, sym(url)));
      }
    }
  });
  if (record[`product_owner_title${postfix}`]) {
    const title = honorificPrefixes[record[`product_owner_title${postfix}`]];
    if (title) {
      contactStatements.push(new Statement(sym(contactPointUri), VCARD('honorific-prefix'), lit(title, 'nl')));
    } else {
      errorLogger('product owner title', record[`product_owner_title${postfix}`], recordId);
    }
  }
  [
    { property: `product_owner_first_name${postfix}`, predicate: FOAF('firstName') },
    { property: `product_owner_last_name${postfix}`, predicate: FOAF('givenName') },
  ].forEach((prop) => {
    if (record[prop.property]) {
      const value = record[prop.property];
      if (value) {
        contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, lit(value)));
      }
    }
  });

  const address = mapAddress(orgId, record, 'product_owner_', postfix);
  if (address) {
    contactStatements = [
      new Statement(sym(contactPointUri), LOCN('address'), sym(address.uri)),
      ...address.statements,
    ];
  }

  if (contactStatements.length) {
    contactStatements.push(new Statement(sym(contactPointUri), RDF('type'), SCHEMA('ContactPoint')));
    contactStatements.push(new Statement(sym(contactPointUri), MU('uuid'), lit(contactPointUuid)));
    statements = [
      ...statements,
      ...contactStatements,
    ];
  }
  return { uri, statements };
}

function mapOfferingAgent(recordId, record, errorLogger, postfix = '') {
  const orgId = record[`agent_contact_id${postfix}`];
  const { uuid, uri } = uriGenerator.organisation(orgId);

  let statements = [
    new Statement(sym(uri), RDF('type'), ORG('Organisation')),
    new Statement(sym(uri), MU('uuid'), lit(uuid)),
  ];

  if (record[`agent_company_name${postfix}`]) {
    statements.push(new Statement(sym(uri), SKOS('prefLabel'), lit(record[`agent_company_name${postfix}`], 'nl')));
  }

  if (record[`agent_company_identification${postfix}`]) {
    const { uuid: orgIdUuid, uri: orgIdUri } = uriGenerator.organisationIdentifier(orgId);
    statements = [
      new Statement(sym(orgIdUri), RDF('type'), ADMS('Identifier')),
      new Statement(sym(orgIdUri), MU('uuid'), lit(orgIdUuid)),
      new Statement(sym(orgIdUri), SKOS('notation'), lit(record[`agent_company_identification${postfix}`])),
      ...statements,
    ];
  }

  const { contactPointUuid, contactPointUri } = uriGenerator.contactPoint(orgId, 'organisation');
  let contactStatements = [];
  [
    { property: `agent_phone1${postfix}`, predicate: SCHEMA('telephone') },
    { property: `agent_phone2${postfix}`, predicate: SCHEMA('telephone') },
    { property: `agent_phone3${postfix}`, predicate: SCHEMA('telephone') },
    { property: `agent_email${postfix}`, predicate: SCHEMA('email') },
    { property: `agent_website${postfix}`, predicate: FOAF('page') },
  ].forEach((prop) => {
    if (record[prop.property]) {
      const url = normalizeUrl(record[prop.property], prop.property);
      if (isValidURL(url)) {
        contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, sym(url)));
      }
    }
  });
  if (record[`agent_title${postfix}`]) {
    const title = honorificPrefixes[record[`agent_title${postfix}`]];
    if (title) {
      contactStatements.push(new Statement(sym(contactPointUri), VCARD('honorific-prefix'), lit(title, 'nl')));
    } else {
      errorLogger('agent title' , record[`agent_title${postfix}`], recordId);
    }
  }
  [
    { property: `agent_first_name${postfix}`, predicate: FOAF('firstName') },
    { property: `agent_last_name${postfix}`, predicate: FOAF('givenName') },
  ].forEach((prop) => {
    if (record[prop.property]) {
      const value = record[prop.property];
      if (value) {
        contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, lit(value)));
      }
    }
  });

  const address = mapAddress(orgId, record, 'agent_', postfix);
  if (address) {
    contactStatements = [
      new Statement(sym(contactPointUri), LOCN('address'), sym(address.uri)),
      ...address.statements,
    ];
  }

  if (contactStatements.length) {
    contactStatements.push(new Statement(sym(contactPointUri), RDF('type'), SCHEMA('ContactPoint')));
    contactStatements.push(new Statement(sym(contactPointUri), MU('uuid'), lit(contactPointUuid)));
    statements = [
      ...statements,
      ...contactStatements,
    ];
  }
  return { uri, statements };
}

export {
  mapContactPoints,
  mapProductOwner,
  mapOfferingAgent
}
