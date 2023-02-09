import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { isValidURL, normalizeUrl } from '../helpers';
import { honorificPrefixes } from './codelists';
import { ADMS, FOAF, LOCN, MU, ORG, RDF, SCHEMA, SKOS, VCARD } from './prefixes';
import { mapAddress } from './address';

function mapTvaContact(recordId, record) {
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
      console.error(`Cannot map TVA contact title value '${record['tva_contact_title']}' for record ${recordId}`);
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

  const address = mapAddress(contactId, record, 'tva_contact_');
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

function mapTvaOrganisation(recordId, record) {
  const orgId = record['tva_organization_contact_id'];
  const { uuid, uri } = uriGenerator.organisation(orgId);

  let statements = [];

  if (record['tva_organization_company_name']) {
    statements.push(new Statement(sym(uri), SKOS('prefLabel'), lit(record['tva_organization_company_name'], 'nl')));
  }

  if (record['tva_organization_company_identification']) {
    const { uuid: orgIdUuid, uri: orgIdUri } = uriGenerator.organisationIdentifier(orgId);
    statements = [
      new Statement(sym(orgIdUri), RDF('type'), ADMS('Identifier')),
      new Statement(sym(orgIdUri), MU('uuid'), lit(orgIdUuid)),
      new Statement(sym(orgIdUri), SKOS('notation'), lit(record['tva_organization_company_identification'])),
      ...statements,
    ];
  }

  const { contactPointUuid, contactPointUri } = uriGenerator.contactPoint(orgId, 'organisation');
  const contactStatements = [];
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
        contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, sym(url)));
      }
    }
  });

  const address = mapAddress(orgId, record, 'tva_organization_');
  if (address) {
    contactStatements = [
      new Statement(sym(contactPointUri), LOCN('address'), sym(address.uri)),
      ...address.statements,
    ];
  }

  if (contactStatements.length) {
    contactStatements.push(new Statement(sym(contactPointUri), RDF('type'), SCHEMA('ContactPoint')));
    contactStatements.push(new Statement(sym(contactPointUri), MU('uuid'), lit(contactPointUuid)));
    contactStatements.push(new Statement(sym(contactPointUri), SCHEMA('contactType'), lit('TVA Organisatie'))),

    statements = [
      ...statements,
      ...contactStatements,
    ];
  }

  if (statements.length) {
    statements = [
      new Statement(sym(uri), RDF('type'), ORG('Organisation')),
      new Statement(sym(uri), MU('uuid'), lit(uuid)),
      ...statements,
    ];

    return { uri, statements };
  } else {
    return null;
  }
}

export {
  mapTvaContact,
  mapTvaOrganisation
}
