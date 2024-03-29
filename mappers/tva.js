import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { isValidURL, normalizeUrl } from '../helpers';
import { nonStandardizedUnitMap, honorificPrefixes } from './codelists';
import { ADMS, FOAF, LOCN, MU, ORG, RDF, SCHEMA, SKOS, VCARD } from './prefixes';
import { mapAddress } from './address';

function mapTvaCapacities(recordId, record) {
  const capacities = [];
  [
    'tva_capacity'
  ].forEach((field) => {
    if (record[field]) {
      const value = `${record[field]}`;

      const unit = nonStandardizedUnitMap[field];
      const { uuid, uri } = uriGenerator.quantitativeValue(recordId, unit);

      const statements = [
        new Statement(sym(uri), RDF('type'), SCHEMA('QuantitativeValue')),
        new Statement(sym(uri), MU('uuid'), lit(uuid)),
        new Statement(sym(uri), SCHEMA('value'), lit(value)),
        new Statement(sym(uri), SCHEMA('unitText'), lit(unit, 'nl')),
      ];

      capacities.push({ uri, statements });
    }
  });
  return capacities;
}

function mapTvaContact(recordId, record, errorLogger) {
  const contactId = record['tva_contact_contact_id'];
  const { uuid, uri } = uriGenerator.contactPoint(contactId, 'tva');

  let statements = [];
  [
    { property: 'tva_contact_phone1', predicate: SCHEMA('telephone') },
    { property: 'tva_contact_phone2', predicate: SCHEMA('telephone') },
    { property: 'tva_contact_phone3', predicate: SCHEMA('telephone') },
    { property: 'tva_contact_email', predicate: SCHEMA('email') },
    { property: 'tva_contact_website', predicate: FOAF('page') },
  ].forEach((prop) => {
    if (record[prop.property]) {
      const url = normalizeUrl(record[prop.property], prop.property);
      if (isValidURL(url)) {
        statements.push(new Statement(sym(uri), prop.predicate, sym(url)));
      }
    }
  });
  if (record['tva_contact_title']) {
    const title = honorificPrefixes[record['tva_contact_title']];
    if (title) {
      statements.push(new Statement(sym(uri), VCARD('honorific-prefix'), lit(title, 'nl')));
    } else {
      errorLogger('tva_contact_title', record['tva_contact_title'], recordId);
    }
  }
  [
    { property: 'tva_contact_first_name', predicate: FOAF('firstName') },
    { property: 'tva_contact_last_name', predicate: FOAF('givenName') },
  ].forEach((prop) => {
    if (record[prop.property]) {
      const value = record[prop.property];
      if (value) {
        statements.push(new Statement(sym(uri), prop.predicate, lit(value)));
      }
    }
  });

  const address = mapAddress(contactId, record, errorLogger, 'tva_contact_');
  if (address) {
    statements = [
      new Statement(sym(uri), LOCN('address'), sym(address.uri)),
      ...address.statements,
    ];
  }

  if (statements.length) {
    statements = [
      new Statement(sym(uri), RDF('type'), SCHEMA('ContactPoint')),
      new Statement(sym(uri), MU('uuid'), lit(uuid)),
      new Statement(sym(uri), SCHEMA('contactType'), lit('TVA Contact')),
      ...statements,
    ];

    return { uri, statements };
  } else {
    return null;
  }
}

function mapTvaOrganisation(recordId, record, errorLogger) {
  const orgId = record['tva_organization_contact_id'];
  const { uuid: orgUuid, uri: orgUri } = uriGenerator.organisation(orgId);
  const { uuid, uri } = uriGenerator.contactPoint(orgId, 'organisation');

  let orgStatements = [];

  if (record['tva_organization_company_name']) {
    orgStatements.push(new Statement(sym(orgUri), SKOS('prefLabel'), lit(record['tva_organization_company_name'], 'nl')));
  }

  if (record['tva_organization_company_identification']) {
    const { uuid: orgIdUuid, uri: orgIdUri } = uriGenerator.organisationIdentifier(orgId);
    orgStatements = [
      new Statement(sym(orgUri), ADMS('identifier'), sym(orgIdUri)),
      new Statement(sym(orgIdUri), RDF('type'), ADMS('Identifier')),
      new Statement(sym(orgIdUri), MU('uuid'), lit(orgIdUuid)),
      new Statement(sym(orgIdUri), SKOS('notation'), lit(record['tva_organization_company_identification'])),
      ...orgStatements,
    ];
  }

  if (orgStatements.length) {
    orgStatements = [
      new Statement(sym(orgUri), SCHEMA('contactPoint'), sym(uri)),
      new Statement(sym(orgUri), RDF('type'), ORG('Organisation')),
      new Statement(sym(orgUri), MU('uuid'), lit(orgUuid)),
      ...orgStatements,
    ];
  }

  let contactStatements = [];
  [
    { property: 'tva_organization_phone1', predicate: SCHEMA('telephone') },
    { property: 'tva_organization_phone2', predicate: SCHEMA('telephone') },
    { property: 'tva_organization_phone3', predicate: SCHEMA('telephone') },
    { property: 'tva_organization_email', predicate: SCHEMA('email') },
    { property: 'tva_organization_website', predicate: FOAF('page') },
  ].forEach((prop) => {
    if (record[prop.property]) {
      const url = normalizeUrl(record[prop.property], prop.property);
      if (isValidURL(url)) {
        contactStatements.push(new Statement(sym(uri), prop.predicate, sym(url)));
      }
    }
  });

  const address = mapAddress(orgId, record, errorLogger, 'tva_organization_');
  if (address) {
    contactStatements = [
      new Statement(sym(uri), LOCN('address'), sym(address.uri)),
      ...address.statements,
    ];
  }

  const statements = [
    ...contactStatements,
    ...orgStatements,
  ];
  if (statements.length) {
    statements.push(new Statement(sym(uri), RDF('type'), SCHEMA('ContactPoint')));
    statements.push(new Statement(sym(uri), MU('uuid'), lit(uuid)));
    statements.push(new Statement(sym(uri), SCHEMA('contactType'), lit('TVA Organisatie')));
    return { uri, statements };
  } else {
    return null;
  }
}

export {
  mapTvaCapacities,
  mapTvaContact,
  mapTvaOrganisation
}
