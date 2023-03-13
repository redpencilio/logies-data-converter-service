import { sym, lit, graph, Namespace } from 'rdflib';
import { PRIVATE_GROUPS } from '../config/env';
import uriGenerator from '../helpers/uri-helpers';
import { litDateTime } from '../helpers';
import { ADMS, DCT, LOCN, LOGIES, MU, RDF, SCHEMA, TVL, XSD } from './prefixes';
import { informationGroupsMap, productCategoriesMap, locationTypesMap, graphScopes } from './codelists';
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

export default function mapLodgings(records, translations, errorLogger) {
  const publicG = graph(); // just an alias
  const graphs = {
    public: publicG,
  };

  for (const group of PRIVATE_GROUPS) {
    graphs[`private-${group}`] = graph();
  }

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
        errorLogger('information_group', record['information_group'], recordId);
      }
    }

    if (record['sub_type']) {
      const type = productCategoriesMap[record['sub_type']];
      if (type) {
        publicG.add(sym(lodgingUri), SCHEMA('keywords'), sym(type));
      } else {
        errorLogger('sub_type', record['sub_type'], recordId);
      }
    }

    if (record['location_type']) {
      const type = locationTypesMap[record['location_type']];
      if (type) {
        publicG.add(sym(lodgingUri), SCHEMA('keywords'), sym(type));
      } else if (type === undefined) {
        errorLogger('location_type', record['location_type'], recordId);
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

    const registrations = mapRegistrations(recordId, record, errorLogger);
    registrations.forEach((registration) => {
      publicG.add(sym(lodgingUri), LOGIES('heeftRegistratie'), sym(registration.uri));
      publicG.addAll(registration.statements);
    });

    const parentProducts = mapAlternateExploitations(recordId, record, errorLogger);
    parentProducts.forEach((parent) => {
      publicG.add(sym(parent.uri), LOGIES('heeftAlternatieveUitbating'), sym(lodgingUri));
    });

    const address = mapAddress(recordId, record, errorLogger);
    if (address) {
      publicG.add(sym(lodgingUri), LOCN('address'), sym(address.uri));
      publicG.add(sym(lodgingUri), LOGIES('onthaalAdres'), sym(address.uri));
      publicG.addAll(address.statements);
    }

    const location = mapLocation(recordId, record, errorLogger);
    if (location) {
      publicG.add(sym(lodgingUri), LOCN('location'), sym(location.uri));
      publicG.add(sym(lodgingUri), LOGIES('onthaalLocatie'), sym(location.uri));
      publicG.addAll(location.statements);
    }

    const touristicRegion = mapTouristicRegion(recordId, record, errorLogger);
    if (touristicRegion) {
      publicG.add(sym(lodgingUri), LOGIES('behoortTotToeristischeRegio'), sym(touristicRegion.uri));
    }

    const statsRegion = mapStatisticalRegion(recordId, record);
    if (statsRegion) {
      publicG.add(sym(lodgingUri), TVL('belongsToStatisticalRegion'), sym(statsRegion.uri));
    }

    const contactPoints = mapContactPoints(recordId, record, errorLogger);
    contactPoints.forEach((contactPoint) => {
      publicG.add(sym(lodgingUri), SCHEMA('contactPoint'), sym(contactPoint.uri));
      publicG.addAll(contactPoint.statements);
    });

    const mediaObjects = mapMediaObjects(recordId, record, errorLogger);
    mediaObjects.forEach((mediaObject) => {
      publicG.add(sym(lodgingUri), LOGIES('heeftMedia'), sym(mediaObject.uri));
      publicG.addAll(mediaObject.statements);
    });

    const mainMediaObjects = mapMainMediaObjects(recordId, record, errorLogger);
    mainMediaObjects.forEach((mediaObject) => {
      publicG.add(sym(lodgingUri), SCHEMA('image'), sym(mediaObject.uri));
      publicG.addAll(mediaObject.statements);
    });

    const accessibilityLabel = mapAccessibilityLabel(recordId, record, errorLogger);
    if (accessibilityLabel) {
      publicG.add(sym(lodgingUri), LOGIES('heeftKwaliteitslabel'), sym(accessibilityLabel.uri));
      publicG.addAll(accessibilityLabel.statements);
    }

    const greenLabel = mapGreenLabel(recordId, record, errorLogger);
    if (greenLabel) {
      publicG.add(sym(lodgingUri), LOGIES('heeftKwaliteitslabel'), sym(greenLabel.uri));
      publicG.addAll(greenLabel.statements);
    }

    const camperLabel = mapCamperLabel(recordId, record, errorLogger);
    if (camperLabel) {
      publicG.add(sym(lodgingUri), LOGIES('heeftKwaliteitslabel'), sym(camperLabel.uri));
      publicG.addAll(camperLabel.statements);
    }

    const accessibilityInformation = mapAccessibilityInformation(recordId, record);
    if (accessibilityInformation) {
      publicG.add(sym(accessibilityInformation.uri), DCT('subject'), sym(lodgingUri));
      publicG.addAll(accessibilityInformation.statements);
    }

    const ratings = mapRatings(recordId, record, errorLogger);
    ratings.forEach((rating) => {
      publicG.add(sym(lodgingUri), SCHEMA('starRating'), sym(rating.uri));
      publicG.addAll(rating.statements);
    });


    /* Private data FOD */
    const fodScope = 'private-fod-economy';
    const capacities = mapCapacities(recordId, record);
    capacities.forEach((capacity) => {
      graphs[fodScope].add(sym(lodgingUri), LOGIES('capaciteit'), sym(capacity.uri));
      graphs[fodScope].addAll(capacity.statements);
    });

    const productOwnerFod = mapProductOwner(recordId, record, '_fod');
    if (productOwnerFod) {
      graphs[fodScope].add(sym(productOwnerFod.uri), SCHEMA('owns'), sym(lodgingUri));
      graphs[fodScope].addAll(productOwnerFod.statements);
    }

    const fodIdentifier = mapFodIdentifier(recordId, record);
    if (fodIdentifier) {
      graphs[fodScope].add(sym(lodgingUri), ADMS('identifier'), sym(fodIdentifier.uri));
      graphs[fodScope].addAll(fodIdentifier.statements);
    }

    if (record['partnerlabel_fod']) {
      graphs[fodScope].add(sym(lodgingUri), DCT('identifier'), lit(record['partnerlabel_fod']));
    }

    const offeringAgentFod = mapOfferingAgent(recordId, record, '_fod');
    if (offeringAgentFod) {
      graphs[fodScope].add(sym(lodgingUri), SCHEMA('offeredBy'), sym(offeringAgentFod.uri));
      graphs[fodScope].addAll(offeringAgentFod.statements);
    }


    /* Private data TVA (CJT) */
    const tvaScope = 'private-tva';

    const fireSafetyCertificate = mapFireSafetyCertificate(recordId, record);
    if (fireSafetyCertificate) {
      graphs[tvaScope].add(sym(fireSafetyCertificate.uri), DCT('subject'), sym(lodgingUri));
      graphs[tvaScope].addAll(fireSafetyCertificate.statements);
    }

    if (record['fire_safety_advice']) {
      graphs[tvaScope].add(sym(lodgingUri), TVL('receivedFireSafetyAdvice'), lit('true', null, XSD('boolean')));
    }

    const propertyValues = mapPropertyValues(recordId, record);
    propertyValues.forEach((propertyValue) => {
      graphs[tvaScope].add(sym(lodgingUri), SCHEMA('additionalProperty'), sym(propertyValue.uri));
      graphs[tvaScope].addAll(propertyValue.statements);
    });

    const tvaIdentifier = mapTvaIdentifier(recordId, record, errorLogger);
    if (tvaIdentifier) {
      graphs[tvaScope].add(sym(lodgingUri), ADMS('identifier'), sym(tvaIdentifier.uri));
      graphs[tvaScope].addAll(tvaIdentifier.statements);
    }

    const tvaContactPoint = mapTvaContact(recordId, record, errorLogger);
    if (tvaContactPoint) {
      graphs[tvaScope].add(sym(lodgingUri), SCHEMA('contactPoint'), sym(tvaContactPoint.uri));
      graphs[tvaScope].addAll(tvaContactPoint.statements);
    }

    const tvaOrganisation = mapTvaOrganisation(recordId, record, errorLogger);
    if (tvaOrganisation) {
      graphs[tvaScope].add(sym(lodgingUri), SCHEMA('contactPoint'), sym(tvaOrganisation.uri));
      graphs[tvaScope].addAll(tvaOrganisation.statements);
    }

    if (record['tva_capacity']) {
      graphs[tvaScope].add(sym(lodgingUri), LOGIES('aantalSlaapplaatsen'), lit(record['tva_capacity'], undefined, XSD('integer')));
    }

    /* Private data FOD and TVA (CJT) */
    for (const scope of [fodScope, tvaScope]) {
      if (record['number_of_units']) {
        graphs[scope].add(sym(lodgingUri), LOGIES('aantalVerhuureenheden'), lit(record['number_of_units'], undefined, XSD('integer')));
      }

      if (record['maximum_capacity']) {
        graphs[scope].add(sym(lodgingUri), LOGIES('aantalSlaapplaatsen'), lit(record['maximum_capacity'], undefined, XSD('integer')));
      }
    }


    /* Private data provinces */
    const provinceGraphs = graphScopes(record['province'], record['statistical_region']);

    if (record['product_owner_share_with_partners']) {
      const productOwner = mapProductOwner(recordId, record);
      if (productOwner) {
        provinceGraphs.forEach((scope) => {
          graphs[scope].add(sym(productOwner.uri), SCHEMA('owns'), sym(lodgingUri));
          graphs[scope].addAll(productOwner.statements);
        });
      }
    }

    if (record['agent_share_with_partners']) {
      const offeringAgent = mapOfferingAgent(recordId, record, errorLogger);
      if (offeringAgent) {
        provinceGraphs.forEach((scope) => {
          graphs[scope].add(sym(lodgingUri), SCHEMA('offeredBy'), sym(offeringAgent.uri));
          graphs[scope].addAll(offeringAgent.statements);
        });
      }
    }

    /* Translation data (all public) */
    for (const translation of translations) {
      const translationRecord = translation.records.find((record) => record['business_product_id'] == recordId);
      if (translationRecord) {
        mapTranslation(translation.lang, publicG, recordId, translationRecord, lodgingUri);
      }
    }
  });

  return graphs;
}
