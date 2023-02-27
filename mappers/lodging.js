import { sym, lit, graph, Namespace } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { litDateTime } from '../helpers';
import { ADMS, DCT, LOCN, LOGIES, MU, RDF, SCHEMA, TVL, XSD } from './prefixes';
import { informationGroupsMap, productCategoriesMap, locationTypesMap } from './codelists';
import { mapTvlIdentifier, mapFodIdentifier, mapTvaIdentifier } from './identifier';
import { mapAlternateExploitations, mapRegistrations } from './registration';
import { mapAddress, mapLocation, mapTouristicRegion, mapStatisticalRegion } from './address';
import { mapContactPoints, mapProductOwner, mapOfferingAgent } from './contact-info';
import { mapTvaContact, mapTvaOrganisation } from './tva';
import { mapRatings } from './rating';
import { mapCapacities, mapPropertyValues } from './capacity';
import { mapAccessibilityLabel, mapGreenLabel, mapCamperLabel, mapFireSafetyCertificate } from './quality-label';
import { mapAccessibilityInformation } from './accessibility';
import { mapMediaObjects, mapMainMediaObjects } from './media-object';
import { mapTranslation } from './translation';

// Deprecated fields
// - legacy_tdb_subcategory_id
// - legacy_vlis_id
// - source_id
// - tva_capacity_old
// - tva_acknowledgement_old
// - pub_categoryTGL
// - pub_groupTGL

// TODO Fields missing in mapping
// - partnerlabel_fod

export default function mapLodgings(records, translations) {
  const publicG = graph();
  const privateG = graph();

  records.filter((record) => !record.deleted).forEach((record) => {
    const recordId = `${record['business_product_id']}`;

    const { uuid: lodgingUuid, uri: lodgingUri } = uriGenerator.touristAttraction(recordId);

    publicG.add(sym(lodgingUri), RDF('type'), SCHEMA('TouristAttraction'));
    publicG.add(sym(lodgingUri), RDF('type'), LOGIES('Logies'));
    publicG.add(sym(lodgingUri), MU('uuid'), lit(lodgingUuid));

    if (record['name']) {
      publicG.add(sym(lodgingUri), SCHEMA('name'), lit(record['name'], 'nl'));
    }
    if (record['name'] != record['name_or_number']) {
      publicG.add(sym(lodgingUri), SCHEMA('alternativeName'), lit(record['name_or_number'], 'nl'));
    }

    if (record['information_group']) {
      const type = informationGroupsMap[record['information_group']];
      if (type) {
        publicG.add(sym(lodgingUri), RDF('type'), sym(type));
      } else {
        console.error(`Cannot map information group value '${record['information_group']}' for record ${recordId}`);
      }
    }

    if (record['sub_type']) {
      const type = productCategoriesMap[record['sub_type']];
      if (type) {
        publicG.add(sym(lodgingUri), SCHEMA('keywords'), sym(type));
      } else {
        console.error(`Cannot map subtype value '${record['sub_type']}' for record ${recordId}`);
      }
    }

    if (record['location_type']) {
      const type = locationTypesMap[record['location_type']];
      if (type) {
        publicG.add(sym(lodgingUri), SCHEMA('keywords'), sym(type));
      } else if (type === undefined) {
        console.error(`Cannot map location type value '${record['location_type']}' for record ${recordId}`);
      }
    }

    const tvlIdentifier = mapTvlIdentifier(recordId, record);
    publicG.add(sym(lodgingUri), ADMS('identifier'), sym(tvlIdentifier.uri));
    publicG.addAll(tvlIdentifier.statements);

    try {
      const modified = new Date(record['changed_time']);
      publicG.add(sym(lodgingUri), DCT('modified'), litDateTime(modified));
    } catch (_) {
      // Invalid or no changed_time
    }

    const registrations = mapRegistrations(recordId, record);
    registrations.forEach((registration) => {
      publicG.add(sym(lodgingUri), LOGIES('heeftRegistratie'), sym(registration.uri));
      publicG.addAll(registration.statements);
    });

    const parentProducts = mapAlternateExploitations(recordId, record);
    parentProducts.forEach((parent) => {
      publicG.add(sym(parent.uri), LOGIES('heeftAlternatieveUitbating'), sym(lodgingUri));
    });

    const address = mapAddress(recordId, record);
    if (address) {
      publicG.add(sym(lodgingUri), LOGIES('onthaalAdres'), sym(address.uri));
      publicG.addAll(address.statements);
    }

    const location = mapLocation(recordId, record);
    if (location) {
      publicG.add(sym(lodgingUri), LOGIES('onthaalLocatie'), sym(location.uri));
      publicG.addAll(location.statements);
    }

    const touristicRegion = mapTouristicRegion(recordId, record);
    if (touristicRegion) {
      publicG.add(sym(lodgingUri), LOGIES('behoortTotToeristischeRegio'), sym(touristicRegion.uri));
    }

    const statsRegion = mapStatisticalRegion(recordId, record);
    if (statsRegion) {
      publicG.add(sym(lodgingUri), TVL('belongsToStatisticalRegion'), sym(statsRegion.uri));
    }

    const contactPoints = mapContactPoints(recordId, record);
    contactPoints.forEach((contactPoint) => {
      publicG.add(sym(lodgingUri), SCHEMA('contactPoint'), sym(contactPoint.uri));
      publicG.addAll(contactPoint.statements);
    });

    const mediaObjects = mapMediaObjects(recordId, record);
    mediaObjects.forEach((mediaObject) => {
      publicG.add(sym(lodgingUri), LOGIES('heeftMedia'), sym(mediaObject.uri));
      publicG.addAll(mediaObject.statements);
    });

    const mainMediaObjects = mapMainMediaObjects(recordId, record);
    mainMediaObjects.forEach((mediaObject) => {
      publicG.add(sym(lodgingUri), SCHEMA('image'), sym(mediaObject.uri));
      publicG.addAll(mediaObject.statements);
    });

    const accessibilityLabel = mapAccessibilityLabel(recordId, record);
    if (accessibilityLabel) {
      publicG.add(sym(lodgingUri), LOGIES('heeftKwaliteitslabel'), sym(accessibilityLabel.uri));
      publicG.addAll(accessibilityLabel.statements);
    }

    const greenLabel = mapGreenLabel(recordId, record);
    if (greenLabel) {
      publicG.add(sym(lodgingUri), LOGIES('heeftKwaliteitslabel'), sym(greenLabel.uri));
      publicG.addAll(greenLabel.statements);
    }

    const camperLabel = mapCamperLabel(recordId, record);
    if (camperLabel) {
      publicG.add(sym(lodgingUri), LOGIES('heeftKwaliteitslabel'), sym(camperLabel.uri));
      publicG.addAll(camperLabel.statements);
    }

    const fireSafetyCertificate = mapFireSafetyCertificate(recordId, record);
    if (fireSafetyCertificate) {
      publicG.add(sym(fireSafetyCertificate.uri), DCT('subject'), sym(lodgingUri));
      publicG.addAll(fireSafetyCertificate.statements);
    }

    if (record['fire_safety_advice']) {
      publicG.add(sym(lodgingUri), TVL('receivedFireSafetyAdvice'), lit('true', null, XSD('boolean')));
    }

    const accessibilityInformation = mapAccessibilityInformation(recordId, record);
    if (accessibilityInformation) {
      publicG.add(sym(accessibilityInformation.uri), DCT('subject'), sym(lodgingUri));
      publicG.addAll(accessibilityInformation.statements);
    }

    const ratings = mapRatings(recordId, record);
    ratings.forEach((rating) => {
      publicG.add(sym(lodgingUri), SCHEMA('starRating'), sym(rating.uri));
      publicG.addAll(rating.statements);
    });

    if (record['number_of_units']) {
      publicG.add(sym(lodgingUri), LOGIES('aantalVerhuureenheden'), lit(record['number_of_units'], undefined, XSD('integer')));
    }

    ['maximum_capacity', 'tva_capacity']
      .map((field) => record[field])
      .filter((value) => value)
      .forEach((value) => {
      publicG.add(sym(lodgingUri), LOGIES('aantalSlaapplaatsen'), lit(value, undefined, XSD('integer')));
      });

    const capacities = mapCapacities(recordId, record);
    capacities.forEach((capacity) => {
      publicG.add(sym(lodgingUri), LOGIES('capaciteit'), sym(capacity.uri));
      publicG.addAll(capacity.statements);
    });

    const propertyValues = mapPropertyValues(recordId, record);
    propertyValues.forEach((propertyValue) => {
      publicG.add(sym(lodgingUri), SCHEMA('additionalProperty'), sym(propertyValue.uri));
      publicG.addAll(propertyValue.statements);
    });

    const tvaIdentifier = mapTvaIdentifier(recordId, record);
    if (tvaIdentifier) {
      publicG.add(sym(lodgingUri), ADMS('identifier'), sym(tvaIdentifier.uri));
      publicG.addAll(tvaIdentifier.statements);
    }

    const tvaContactPoint = mapTvaContact(recordId, record);
    if (tvaContactPoint) {
      privateG.add(sym(lodgingUri), SCHEMA('contactPoint'), sym(tvaContactPoint.uri));
      privateG.addAll(tvaContactPoint.statements);
    }

    const tvaOrganisation = mapTvaOrganisation(recordId, record);
    if (tvaOrganisation) {
      privateG.add(sym(lodgingUri), SCHEMA('contactPoint'), sym(tvaOrganisation.uri));
      privateG.addAll(tvaOrganisation.statements);
    }

    if (record['product_owner_share_with_partners']) {
      const productOwner = mapProductOwner(recordId, record);
      if (productOwner) {
        publicG.add(sym(productOwner.uri), SCHEMA('owns'), sym(lodgingUri));
        publicG.addAll(productOwner.statements);
      }
    }

    const productOwnerFod = mapProductOwner(recordId, record, '_fod');
    if (productOwnerFod) {
      privateG.add(sym(productOwnerFod.uri), SCHEMA('owns'), sym(lodgingUri));
      privateG.addAll(productOwnerFod.statements);
    }

    const fodIdentifier = mapFodIdentifier(recordId, record);
    if (fodIdentifier) {
      privateG.add(sym(lodgingUri), ADMS('identifier'), sym(fodIdentifier.uri));
      privateG.addAll(fodIdentifier.statements);
    }

    if (record['partnerlabel_fod']) {
      privateG.add(sym(lodgingUri), DCT('identifier'), lit(record['partnerlabel_fod']));
    }

    if (record['agent_share_with_partners']) {
      const offeringAgent = mapOfferingAgent(recordId, record);
      if (offeringAgent) {
        publicG.add(sym(lodgingUri), SCHEMA('offeredBy'), sym(offeringAgent.uri));
        publicG.addAll(offeringAgent.statements);
      }
    }

    const offeringAgentFod = mapOfferingAgent(recordId, record, '_fod');
    if (offeringAgentFod) {
      privateG.add(sym(lodgingUri), SCHEMA('offeredBy'), sym(offeringAgentFod.uri));
      privateG.addAll(offeringAgentFod.statements);
    }

    for (const translation of translations) {
      const translationRecord = translation.records.find((record) => record['business_product_id'] == recordId);
      if (translationRecord) {
        mapTranslation(translation.lang, publicG, recordId, translationRecord, lodgingUri);
      }
    }
  });

  return [publicG, privateG];
}
