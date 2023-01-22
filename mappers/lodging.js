import { sym, lit, graph, Namespace } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { litDateTime } from '../helpers';
import { ADMS, DCT, LOCN, LOGIES, MU, RDF, SCHEMA, TVL, XSD } from './prefixes';
import { informationGroupsMap } from './codelists';
import { mapTvlIdentifier } from './identifier';
import { mapAlternateExploitations, mapRegistrations } from './registration';
import { mapAddress, mapLocation, mapTouristicRegion, mapStatisticalRegion } from './address';
import { mapContactPoints, mapProductOwner, mapOfferingAgent } from './contact-info';
import { mapRatings } from './rating';
import { mapCapacities } from './capacity';
import { mapAccessibilityLabel, mapGreenLabel } from './quality-label';
import { mapAccessibilityInformation } from './accessibility';
import { mapMediaObjects, mapMainMediaObjects } from './media-object';
import { mapTranslation } from './tourist-attraction';

// TODO Fields missing in mapping
// - legacy_tdb_subcategory_id
// - legacy_vlis_id
// - fire_safety_certificate_expiration_date
// - fire_safety_advice
// - file_number
// - tva_capacity_old
// - tva_capacity_description
// - tva_acknowledgement_old
// - tva_principal_acknowledgement_date
// - tva_suspension_removal_date

// accommodation_accessibility
// - source_id
// - sub_type
// - location_type
// - camper_label
// - file_number
// - tva_principal_acknowledgement_date
// - tva_suspension_removal_date

export default function mapLodgings(records, translations) {
  const store = graph();
  records.filter((record) => !record.deleted).forEach((record) => {
    const recordId = `${record['business_product_id']}`;

    const { uuid: lodgingUuid, uri: lodgingUri } = uriGenerator.touristAttraction(recordId);

    store.add(sym(lodgingUri), RDF('type'), SCHEMA('TouristAttraction'));
    store.add(sym(lodgingUri), RDF('type'), LOGIES('Logies'));
    store.add(sym(lodgingUri), MU('uuid'), lit(lodgingUuid));

    if (record['name']) {
      store.add(sym(lodgingUri), SCHEMA('name'), lit(record['name'], 'nl'));
    }
    if (record['name'] != record['name_or_number']) {
      store.add(sym(lodgingUri), SCHEMA('alternativeName'), lit(record['name_or_number'], 'nl'));
    }

    if (record['information_group']) {
      const type = informationGroupsMap[record['information_group']];
      if (type) {
        store.add(sym(lodgingUri), RDF('type'), sym(type));
      } else {
        console.error(`Cannot map information group value '${record['information_group']}' for record ${recordId}`);
      }
    }

    const tvlIdentifier = mapTvlIdentifier(recordId, record);
    store.add(sym(lodgingUri), ADMS('identifier'), sym(tvlIdentifier.uri));
    store.addAll(tvlIdentifier.statements);

    try {
      const modified = new Date(record['changed_time']);
      store.add(sym(lodgingUri), DCT('modified'), litDateTime(modified));
    } catch (_) {
      // Invalid or no changed_time
    }

    const registrations = mapRegistrations(recordId, record);
    registrations.forEach((registration) => {
      store.add(sym(lodgingUri), LOGIES('heeftRegistratie'), sym(registration.uri));
      store.addAll(registration.statements);
    });

    const parentProducts = mapAlternateExploitations(recordId, record);
    parentProducts.forEach((parent) => {
      store.add(sym(parent.uri), LOGIES('heeftAlternatieveUitbating'), sym(lodgingUri));
    });

    const address = mapAddress(recordId, record);
    if (address) {
      store.add(sym(lodgingUri), LOGIES('onthaalAdres'), sym(address.uri));
      store.addAll(address.statements);
    }

    const location = mapLocation(recordId, record);
    if (location) {
      store.add(sym(lodgingUri), LOGIES('onthaalLocatie'), sym(location.uri));
      store.addAll(location.statements);
    }

    const touristicRegion = mapTouristicRegion(recordId, record);
    if (touristicRegion) {
      store.add(sym(lodgingUri), LOGIES('behoortTotToeristischeRegio'), sym(touristicRegion.uri));
    }

    const statsRegion = mapStatisticalRegion(recordId, record);
    if (statsRegion) {
      store.add(sym(lodgingUri), TVL('belongsToStatisticalRegion'), sym(statsRegion.uri));
    }

    const contactPoints = mapContactPoints(recordId, record);
    contactPoints.forEach((contactPoint) => {
      store.add(sym(lodgingUri), SCHEMA('contactPoint'), sym(contactPoint.uri));
      store.addAll(contactPoint.statements);
    });

    const productOwner = mapProductOwner(recordId, record);
    if (productOwner) {
      store.add(sym(productOwner.uri), SCHEMA('owns'), sym(lodgingUri));
      store.addAll(productOwner.statements);
    }

    const offeringAgent = mapOfferingAgent(recordId, record);
    if (offeringAgent) {
      store.add(sym(lodgingUri), SCHEMA('offeredBy'), sym(offeringAgent.uri));
      store.addAll(offeringAgent.statements);
    }

    const mediaObjects = mapMediaObjects(recordId, record);
    mediaObjects.forEach((mediaObject) => {
      store.add(sym(lodgingUri), LOGIES('heeftMedia'), sym(mediaObject.uri));
      store.addAll(mediaObject.statements);
    });

    const mainMediaObjects = mapMainMediaObjects(recordId, record);
    mainMediaObjects.forEach((mediaObject) => {
      store.add(sym(lodgingUri), SCHEMA('image'), sym(mediaObject.uri));
      store.addAll(mediaObject.statements);
    });

    const accessibilityLabel = mapAccessibilityLabel(recordId, record);
    if (accessibilityLabel) {
      store.add(sym(lodgingUri), LOGIES('heeftKwaliteitslabel'), sym(accessibilityLabel.uri));
      store.addAll(accessibilityLabel.statements);
    }

    const greenLabel = mapGreenLabel(recordId, record);
    if (greenLabel) {
      store.add(sym(lodgingUri), LOGIES('heeftKwaliteitslabel'), sym(greenLabel.uri));
      store.addAll(greenLabel.statements);
    }

    const accessibilityInformation = mapAccessibilityInformation(recordId, record);
    if (accessibilityInformation) {
      store.add(sym(accessibilityInformation.uri), DCT('subject'), sym(lodgingUri));
      store.addAll(accessibilityInformation.statements);
    }

    const ratings = mapRatings(recordId, record);
    ratings.forEach((rating) => {
      store.add(sym(lodgingUri), SCHEMA('starRating'), sym(rating.uri));
      store.addAll(rating.statements);
    });

    if (record['number_of_units']) {
      store.add(sym(lodgingUri), LOGIES('aantalVerhuureenheden'), lit(record['number_of_units'], undefined, XSD('integer')));
    }

    ['maximum_capacity', 'tva_capacity']
      .map((field) => record[field])
      .filter((value) => value)
      .forEach((value) => {
      store.add(sym(lodgingUri), LOGIES('aantalSlaapplaatsen'), lit(value, undefined, XSD('integer')));
      });

    const capacities = mapCapacities(recordId, record);
    capacities.forEach((capacity) => {
      store.add(sym(lodgingUri), LOGIES('capaciteit'), sym(capacity.uri));
      store.addAll(capacity.statements);
    });


    for (const translation of translations) {
      const translationRecord = translation.records.find((record) => record['business_product_id'] == recordId);
      if (translationRecord) {
        mapTranslation(translation.lang, store, recordId, translationRecord, lodgingUri);
      }
    }
  });

  return store.toNT();
}
