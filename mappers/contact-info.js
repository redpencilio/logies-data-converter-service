import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { hasAnyProp, isValidURL } from '../helpers';
import { tvlOrganizationUri, honorificPrefixes } from './codelists';
import { ADMS, FOAF, LOCN, MU, ORG, RDF, SCHEMA, SKOS, VCARD } from './prefixes';
import { mapAddress } from './address';

function isSocialMediaUrl(url, socialMediaChannel) {
  // Naive effort to check whether URL is a full social media URL or just an account name
  return url.startsWith('http') && url.includes(socialMediaChannel);
}

function normalizeUrl(url, channel) {
  if (channel.includes('phone') || channel == 'fax') {
    return `tel:${url.replace(/\s/g, '')}`;
  } else if (channel.includes('email')) {
    return `mailto:${url}`;
  } else if (channel == 'facebook' && !isSocialMediaUrl(url, 'facebook')) {
    return `http://www.facebook.com/${url}`;
  } else if (channel == 'flickr' && !isSocialMediaUrl(url, 'flickr')) {
    return `http://www.flickr.com/${url}`;
  } else if (channel == 'twitter' && !isSocialMediaUrl(url, 'twitter')) {
    return `http://www.twitter.com/${url}`;
  } else if (channel == 'instagram' && !isSocialMediaUrl(url, 'instagram')) {
    return `http://www.instagram.com/${url}`;
  } else if (url.startsWith('www')) {
    return `http://${url}`;
  } else {
    return url;
  }
}

function mapContactPoints(recordId, record) {
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
      const url = normalizeUrl(value);
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
        console.error(`Cannot map invalid ${channel} URL '${value}' for record ${recordId}`);
      }
    }
  };

  return contactPoints;
}

function mapProductOwner(recordId, record) {
  const orgId = record['product_owner_contact_id'];
  const { uuid, uri } = uriGenerator.organisation(orgId);

  const statements = [
    new Statement(sym(uri), RDF('type'), ORG('Organisation')),
    new Statement(sym(uri), MU('uuid'), lit(uuid)),
  ];

  if (record['product_owner_share_with_partners']) {
    if (record['product_owner_company_name']) {
      statements.push(new Statement(sym(uri), SKOS('prefLabel'), lit(record['product_owner_company_name'], 'nl')));
    }

    if (record['product_owner_company_identification']) {
      const { uuid: orgIdUuid, uri: orgIdUri } = uriGenerator.organisationIdentifier(orgId);
      statements = [
        new Statement(sym(orgIdUri), RDF('type'), ADMS('Identifier')),
        new Statement(sym(orgIdUri), MU('uuid'), lit(orgIdUuid)),
        new Statement(sym(orgIdUri), SKOS('notation'), lit(record['product_owner_company_identification'])),
        ...statements,
      ];
    }

    const { contactPointUuid, contactPointUri } = uriGenerator.contactPoint(orgId, 'organisation');
    const contactStatements = [];
    [
      { property: 'product_owner_phone1', predicate: SCHEMA('telephone') },
      { property: 'product_owner_phone2', predicate: SCHEMA('telephone') },
      { property: 'product_owner_phone3', predicate: SCHEMA('telephone') },
      { property: 'product_owner_email', predicate: SCHEMA('email') },
      { property: 'product_owner_website', predicate: FOAF('page') },
    ].forEach((prop) => {
      if (record[prop.property]) {
        const url = normalizeUrl(record[prop.property]);
        if (isValidURL(url)) {
          contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, sym(url)));
        }
      }
    });
    if (record['product_owner_title']) {
      const title = honorificPrefixes[record['product_owner_title']];
      if (title) {
        contactStatements.push(new Statement(sym(contactPointUri), VCARD('honorific-prefix'), lit(title, 'nl')));
      } else {
        console.error(`Cannot map product owner title value '${record['product_owner_title']}' for record ${recordId}`);
      }
    }
    [
      { property: 'product_owner_first_name', predicate: FOAF('firstName') },
      { property: 'product_owner_last_name', predicate: FOAF('givenName') },
    ].forEach((prop) => {
      if (record[prop.property]) {
        const value = record[prop.property];
        if (value) {
          contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, lit(value)));
        }
      }
    });

    const address = mapAddress(orgId, record, 'product_owner_');
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
  } else {
    return null;
  }
}

function mapOfferingAgent(recordId, record) {
  const orgId = record['agent_contact_id'];
  const { uuid, uri } = uriGenerator.organisation(orgId);

  const statements = [
    new Statement(sym(uri), RDF('type'), ORG('Organisation')),
    new Statement(sym(uri), MU('uuid'), lit(uuid)),
  ];

  if (record['agent_share_with_partners']) {
    if (record['agent_company_name']) {
      statements.push(new Statement(sym(uri), SKOS('prefLabel'), lit(record['agent_company_name'], 'nl')));
    }

    if (record['agent_company_identification']) {
      const { uuid: orgIdUuid, uri: orgIdUri } = uriGenerator.organisationIdentifier(orgId);
      statements = [
        new Statement(sym(orgIdUri), RDF('type'), ADMS('Identifier')),
        new Statement(sym(orgIdUri), MU('uuid'), lit(orgIdUuid)),
        new Statement(sym(orgIdUri), SKOS('notation'), lit(record['agent_company_identification'])),
        ...statements,
      ];
    }

    const { contactPointUuid, contactPointUri } = uriGenerator.contactPoint(orgId, 'organisation');
    const contactStatements = [];
    [
      { property: 'agent_phone1', predicate: SCHEMA('telephone') },
      { property: 'agent_phone2', predicate: SCHEMA('telephone') },
      { property: 'agent_phone3', predicate: SCHEMA('telephone') },
      { property: 'agent_email', predicate: SCHEMA('email') },
      { property: 'agent_website', predicate: FOAF('page') },
    ].forEach((prop) => {
      if (record[prop.property]) {
        const url = normalizeUrl(record[prop.property]);
        if (isValidURL(url)) {
          contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, sym(url)));
        }
      }
    });
    if (record['agent_title']) {
      const title = honorificPrefixes[record['agent_title']];
      if (title) {
        contactStatements.push(new Statement(sym(contactPointUri), VCARD('honorific-prefix'), lit(title, 'nl')));
      } else {
        console.error(`Cannot map agent title value '${record['agent_title']}' for record ${recordId}`);
      }
    }
    [
      { property: 'agent_first_name', predicate: FOAF('firstName') },
      { property: 'agent_last_name', predicate: FOAF('givenName') },
    ].forEach((prop) => {
      if (record[prop.property]) {
        const value = record[prop.property];
        if (value) {
          contactStatements.push(new Statement(sym(contactPointUri), prop.predicate, lit(value)));
        }
      }
    });

    const address = mapAddress(orgId, record, 'agent_');
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
  } else {
    return null;
  }
}

export {
  mapContactPoints,
  mapProductOwner,
  mapOfferingAgent
}