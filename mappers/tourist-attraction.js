import { sym, lit, graph } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { litDateTime } from '../helpers';
import { informationGroupsMap, productTypesMap, productCategoriesMap, locationTypesMap } from './codelists';
import { ADMS, DCT, LOCN, LOGIES, MU, RDF, SCHEMA, TVL } from './prefixes';
import { mapAddress, mapLocation, mapTouristicRegion, mapStatisticalRegion } from './address';
import { mapTvlIdentifier } from './identifier';
import { mapContactPoints } from './contact-info';
import { mapMediaObjects, mapMainMediaObjects } from './media-object';
import { mapAccessibilityLabel, mapGreenLabel, mapCamperLabel } from './quality-label';
import { mapAccessibilityInformation } from './accessibility';
import { mapTranslation } from './translation';

export default function mapTouristAttractions(records, translations) {
  const publicG = graph();
  const privateG = graph();

  records.filter((record) => !record.deleted).forEach((record) => {
    const recordId = `${record['business_product_id']}`;

    const { uuid: attractionUuid, uri: attractionUri } = uriGenerator.touristAttraction(recordId);

    publicG.add(sym(attractionUri), RDF('type'), SCHEMA('TouristAttraction'));
    publicG.add(sym(attractionUri), MU('uuid'), lit(attractionUuid));

    if (record['name']) {
      publicG.add(sym(attractionUri), SCHEMA('name'), lit(record['name'], 'nl'));
    }

    if (record['information_group']) {
      const type = informationGroupsMap[record['information_group']];
      if (type) {
        publicG.add(sym(attractionUri), RDF('type'), sym(type));
      } else {
        console.error(`Cannot map information group value '${record['information_group']}' for record ${recordId}`);
      }
    }

    if (record['discriminator']) {
      const type = productTypesMap[record['discriminator']];
      if (type) {
        publicG.add(sym(attractionUri), DCT('type'), sym(type));
      } else {
        console.error(`Cannot map discriminator value '${record['discriminator']}' for record ${recordId}`);
      }
    }

    if (record['sub_type']) {
      const type = productCategoriesMap[record['sub_type']];
      if (type) {
        publicG.add(sym(attractionUri), SCHEMA('keywords'), sym(type));
      } else {
        console.error(`Cannot map subtype value '${record['sub_type']}' for record ${recordId}`);
      }
    }

    if (record['location_type']) {
      const type = locationTypesMap[record['location_type']];
      if (type) {
        publicG.add(sym(attractionUri), SCHEMA('keywords'), sym(type));
      } else if (type === undefined) {
        console.error(`Cannot map location type value '${record['location_type']}' for record ${recordId}`);
      }
    }

    const tvlIdentifier = mapTvlIdentifier(recordId, record);
    publicG.add(sym(attractionUri), ADMS('identifier'), sym(tvlIdentifier.uri));
    publicG.addAll(tvlIdentifier.statements);

    try {
      const modified = new Date(record['changed_time']);
      publicG.add(sym(attractionUri), DCT('modified'), litDateTime(modified));
    } catch (_) {
      // Invalid or no changed_time
    }

    const address = mapAddress(recordId, record);
    if (address) {
      publicG.add(sym(attractionUri), LOCN('address'), sym(address.uri));
      publicG.addAll(address.statements);
    }

    const location = mapLocation(recordId, record);
    if (location) {
      publicG.add(sym(attractionUri), LOCN('geometry'), sym(location.uri));
      publicG.addAll(location.statements);
    }

    const touristicRegion = mapTouristicRegion(recordId, record);
    if (touristicRegion) {
      publicG.add(sym(attractionUri), LOGIES('behoortTotToeristischeRegio'), sym(touristicRegion.uri));
    }

    const statsRegion = mapStatisticalRegion(recordId, record);
    if (statsRegion) {
      publicG.add(sym(attractionUri), TVL('belongsToStatisticalRegion'), sym(statsRegion.uri));
    }

    const contactPoints = mapContactPoints(recordId, record);
    contactPoints.forEach((contactPoint) => {
      publicG.add(sym(attractionUri), SCHEMA('contactPoint'), sym(contactPoint.uri));
      publicG.addAll(contactPoint.statements);
    });

    const mediaObjects = mapMediaObjects(recordId, record);
    mediaObjects.forEach((mediaObject) => {
      publicG.add(sym(attractionUri), LOGIES('heeftMedia'), sym(mediaObject.uri));
      publicG.addAll(mediaObject.statements);
    });

    const mainMediaObjects = mapMainMediaObjects(recordId, record);
    mainMediaObjects.forEach((mediaObject) => {
      publicG.add(sym(attractionUri), SCHEMA('image'), sym(mediaObject.uri));
      publicG.addAll(mediaObject.statements);
    });

    const accessibilityLabel = mapAccessibilityLabel(recordId, record);
    if (accessibilityLabel) {
      publicG.add(sym(attractionUri), LOGIES('heeftKwaliteitslabel'), sym(accessibilityLabel.uri));
      publicG.addAll(accessibilityLabel.statements);
    }

    const greenLabel = mapGreenLabel(recordId, record);
    if (greenLabel) {
      publicG.add(sym(attractionUri), LOGIES('heeftKwaliteitslabel'), sym(greenLabel.uri));
      publicG.addAll(greenLabel.statements);
    }

    const camperLabel = mapCamperLabel(recordId, record);
    if (camperLabel) {
      publicG.add(sym(attractionUri), LOGIES('heeftKwaliteitslabel'), sym(camperLabel.uri));
      publicG.addAll(camperLabel.statements);
    }

    const accessibilityInformation = mapAccessibilityInformation(recordId, record);
    if (accessibilityInformation) {
      publicG.add(sym(accessibilityInformation.uri), DCT('subject'), sym(attractionUri));
      publicG.addAll(accessibilityInformation.statements);
    }

    if (record['reservations']) {
      publicG.add(sym(attractionUri), SCHEMA('acceptsReservations'), lit(record['reservations']));
    }

    for (const translation of translations) {
      const translationRecord = translation.records.find((record) => record['business_product_id'] == recordId);
      if (translationRecord) {
        mapTranslation(translation.lang, publicG, recordId, translationRecord, attractionUri);
      }
    }
  });

  return [publicG, privateG];
}
