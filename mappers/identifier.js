import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { tvlOrganizationUri } from './codelists';
import { ADMS, DCT, MU, RDF, SKOS } from './prefixes';

function mapTvlIdentifier(recordId, record) {
  const { uuid, uri } = uriGenerator.tvlIdentifier(recordId);
  const statements = [
    new Statement(sym(uri), RDF('type'), ADMS('Identifier')),
    new Statement(sym(uri), MU('uuid'), lit(uuid)),
    new Statement(sym(uri), SKOS('notation'), lit(recordId)),
    new Statement(sym(uri), ADMS('schemaAgency'), lit('Toerisme Vlaanderen')),
    new Statement(sym(uri), DCT('creator'), sym(tvlOrganizationUri)),
  ];

  return { uri, statements };
}

function mapFodIdentifier(recordId, record) {
  if (record['statistical_id']) {
    const { uuid, uri } = uriGenerator.fodIdentifier(recordId);
    const statements = [
      new Statement(sym(uri), RDF('type'), ADMS('Identifier')),
      new Statement(sym(uri), MU('uuid'), lit(uuid)),
      new Statement(sym(uri), SKOS('notation'), lit(record['statistical_id'])),
      new Statement(sym(uri), ADMS('schemaAgency'), lit('Federale Overheidsdienst Economie')),
    ];

    return { uri, statements };
  } else {
    return null;
  }
}

function mapTvaIdentifier(recordId, record) {
  if (recordId['file_number']) {
    const { uuid, uri } = uriGenerator.tvaIdentifier(recordId);
    const statements = [
      new Statement(sym(uri), RDF('type'), ADMS('Identifier')),
      new Statement(sym(uri), MU('uuid'), lit(uuid)),
      new Statement(sym(uri), SKOS('notation'), lit(recordId['file_number'])),
      new Statement(sym(uri), ADMS('schemaAgency'), lit('Toerisme Vlaanderen')),
      new Statement(sym(uri), DCT('creator'), sym(tvlOrganizationUri)),
    ];

    return { uri, statements };
  } else {
    return null;
  }
}

export {
  mapTvlIdentifier,
  mapFodIdentifier,
  mapTvaIdentifier
}
