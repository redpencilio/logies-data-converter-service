import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { litDateTime } from '../helpers';
import { tvlOrganizationUri, registrationStatusMap, registrationTypeMap, registrationCategoryMap } from './codelists';
import { ADMS, DCT, LOGIES, MU, PROV, RDF, SKOS, TVL } from './prefixes';

function mapRegistrations(recordId, record, errorLogger) {
  const registrations = [];

  const isLogiesDecreet = ['ACKNOWLEDGED', 'ACKNOWLEDGED_TVA', 'LICENSED', 'NOTIFIED', 'STOPPED', 'LICENSE_REVOKED'].includes(record['status']);

  if (isLogiesDecreet) {
    const registration = mapLodgingDecreeRegistration(recordId, record);
    if (registration) {
      registrations.push(registration);
    }
  }

  return registrations;
}

function mapLodgingDecreeRegistration(recordId, record) {
  const decree = 'logiesDecreet';
  const { uri, uuid } = uriGenerator.registration(recordId, decree);
  const { uri: regIdentifierUri, uuid: regIdentifierUuid } = uriGenerator.registrationIdentifier(recordId, decree);

  let statements = [
    new Statement(sym(uri), RDF('type'), LOGIES('Registratie')),
    new Statement(sym(uri), MU('uuid'), lit(uuid)),
    new Statement(sym(uri), ADMS('identifier'), sym(regIdentifierUri)),
    new Statement(sym(regIdentifierUri), RDF('type'), ADMS('Identifier')),
    new Statement(sym(regIdentifierUri), MU('uuid'), lit(regIdentifierUuid)),
    new Statement(sym(regIdentifierUri), SKOS('notation'), lit(recordId)),
    new Statement(sym(regIdentifierUri), ADMS('schemaAgency'), lit('Toerisme Vlaanderen')),
    new Statement(sym(regIdentifierUri), DCT('creator'), sym(tvlOrganizationUri)),
  ];

  if (record['discriminator']) {
    const category = registrationCategoryMap[record['discriminator']];
    if (category) {
      statements.push(new Statement(sym(uri), TVL('category'), sym(category)));
    }
    const type = registrationTypeMap[record['discriminator']];
    if (type) {
      statements.push(new Statement(sym(uri), DCT('type'), sym(type)));
    }
  }

  if (record['status']) {
    const status = registrationStatusMap[record['status']];
    if (status) {
      statements.push(new Statement(sym(uri), LOGIES('registratieStatus'), sym(status)));
    }

    let date = null;
    if (status == 'LICENSED' || status == 'LICENSE_REVOKED' || status == 'STOPPED') {
      // licensed according to the old decree
      date = record['last_status_change_date'];
    } else if (status == 'NOTIFIED') {
      // notified/aangemeld according to logiesdecreet
      date = record['notification_date'];
    } else if (status == 'ACKNOWLEDGED') {
      // acknowledged/erkend according to logiesdecreet
      date = record['acknowledgement_date'];
    }

    if (date) {
      const { generationUri, generationUuid } = uriGenerator.generation(recordId, decree);
      date = Array.isArray(date) ? new Date(date[0]) : new Date(date);
      statements = [
        new Statement(sym(uri), PROV('qualifiedGeneration'), sym(generationUri)),
        new Statement(sym(generationUri), RDF('type'), PROV('Generation')),
        new Statement(sym(generationUri), MU('uuid'), lit(uuid)),
        new Statement(sym(generationUri), PROV('atTime'), litDateTime(date)),
        ...statements
      ];
    }
  }
  return { uri, statements };
}

function mapAlternateExploitations(recordId, record, errorLogger) {
  if (record['product_type'] == 'PROMO') {
    const parents = (record['parent_product_ids'] || '').split(',');

    if (parents.length) {
      return parents.map((id) => {
        const { uri } = uriGenerator.touristAttraction(id);
        return { uri };
      });
    } else {
      errorLogger('product_type', 'PROMO without parent_product_ids', recordId);
    }
  }

  return [];
}

export {
  mapRegistrations,
  mapAlternateExploitations
}
