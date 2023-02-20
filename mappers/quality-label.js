import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { litDateTime } from '../helpers';
import { accessibilityLabels, tvlOrganizationUri, goodplanetOrganizationUri } from './codelists';
import { LOGIES, MU, RDF, SCHEMA, SKOS } from './prefixes';

function mapAccessibilityLabel(recordId, record, errorLogger) {
  if (record['accessibility_label']) {
    const { uuid, uri } = uriGenerator.qualityLabel(recordId, 'accessibility');
    const accessibility = accessibilityLabels[record['accessibility_label']];

    if (accessibility) {
      const statements = [
        new Statement(sym(uri), RDF('type'), LOGIES('Kwaliteitslabel')),
        new Statement(sym(uri), MU('uuid'), lit(uuid)),
        new Statement(sym(uri), SKOS('prefLabel'), lit(accessibility, 'nl')),
        new Statement(sym(uri), SCHEMA('author'), sym(tvlOrganizationUri)),
      ];

      return { uri, statements };
    } else if (!Object.keys(accessibilityLabels).includes(record['accessibility_label'])) {
      errorLogger(`Cannot map accessibility label value '${record['accessibility_label']}' for record ${recordId}`);
    }
  }
  return null;
}

function mapGreenLabel(recordId, record, errorLogger) {
  if (record['green_key_labeled']) {
    const { uuid, uri } = uriGenerator.qualityLabel(recordId, 'green-label');

    const statements = [
      new Statement(sym(uri), RDF('type'), LOGIES('Kwaliteitslabel')),
      new Statement(sym(uri), MU('uuid'), lit(uuid)),
      new Statement(sym(uri), SKOS('prefLabel'), lit('Green Key', 'nl')),
      new Statement(sym(uri), SKOS('prefLabel'), lit('Green Key', 'en')),
      new Statement(sym(uri), SCHEMA('author'), sym(goodplanetOrganizationUri)),
    ];

    return { uri, statements };
  } else {
    return null;
  }
}

function mapCamperLabel(recordId, record, errorLogger) {
  if (record['camper_label']) {
    const { uuid, uri } = uriGenerator.qualityLabel(recordId, 'camper-label');

    const statements = [
      new Statement(sym(uri), RDF('type'), LOGIES('Kwaliteitslabel')),
      new Statement(sym(uri), MU('uuid'), lit(uuid)),
      new Statement(sym(uri), SKOS('prefLabel'), lit('Kampeerlabel', 'nl')),
      new Statement(sym(uri), SKOS('prefLabel'), lit('Camper label', 'en')),
      new Statement(sym(uri), SCHEMA('author'), sym(tvlOrganizationUri)),
    ];

    return { uri, statements };
  } else {
    return null;
  }
}

function mapFireSafetyCertificate(recordId, record, errorLogger) {
  if (record['fire_safety_certificate_expiration_date']) {
    const { uuid, uri } = uriGenerator.permit(recordId, 'fire-safety-certificate');
    const date = new Date(Date.parse(record['fire_safety_certificate_expiration_date']));
    const statements = [
      new Statement(sym(uri), RDF('type'), SCHEMA('GovernmentPermit')),
      new Statement(sym(uri), MU('uuid'), lit(uuid)),
      new Statement(sym(uri), SCHEMA('name'), lit('Brandveiligheidsattest', 'nl')),
      new Statement(sym(uri), SCHEMA('name'), lit('Fire safety certificate', 'en')),
      new Statement(sym(uri), SCHEMA('validUntil'), litDateTime(date)),
    ];

    return { uri, statements };
  } else {
    return null;
  }
}

export {
  mapAccessibilityLabel,
  mapGreenLabel,
  mapCamperLabel,
  mapFireSafetyCertificate
}
