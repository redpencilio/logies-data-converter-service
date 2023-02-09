import { sym, lit, graph, Namespace } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { litDateTime } from '../helpers';
import { informationGroupsMap, productTypesMap, productCategoriesMap, locationTypesMap } from './codelists';
import { ADMS, DCT, LOCN, LOGIES, MU, RDF, SCHEMA, TVL } from './prefixes';
import { mapAddress, mapLocation, mapTouristicRegion, mapStatisticalRegion } from './address';
import { mapTvlIdentifier } from './identifier';
import { mapContactPoints } from './contact-info';
import { mapMediaObjects, mapMainMediaObjects } from './media-object';
import { mapAccessibilityLabel, mapGreenLabel } from './quality-label';
import { mapProductDescriptions, mapAccessibilityDescription } from './description';
import { mapAccessibilityInformation } from './accessibility';

// Deprecated fields
// - source_id

// Need more info
// - camper_label

export function mapTranslation(lang, store, recordId, record, attractionUri) {
  const descriptions = mapProductDescriptions(recordId, record, lang);
  descriptions.forEach((description) => {
    store.add(sym(attractionUri), LOGIES('heeftBeschrijving'), sym(description.uri));
    store.addAll(description.statements);
  });

  const description = mapAccessibilityDescription(recordId, record, lang);
  if (description) {
    store.add(sym(attractionUri), SCHEMA('accessibilitySummary'), sym(description.uri));
    store.addAll(description.statements);
  }

  const accessibilityInformation = mapAccessibilityInformation(recordId, record, lang);
  if (accessibilityInformation) {
    store.add(sym(accessibilityInformation.uri), DCT('subject'), sym(attractionUri));
    store.addAll(accessibilityInformation.statements);
  }

  const closingHours = [
    record['closing_period'],
    record['next_year_closing_period']
  ].filter((t) => t && t.trim());
  if (closingHours.length) {
    const value = closingHours.join('\n');
    store.add(sym(attractionUri), SCHEMA('openingHours'), lit(value, lang));
  }
}

export default function mapTouristAttractions(records, translations) {
  const store = graph();
  records.filter((record) => !record.deleted).forEach((record) => {
    const recordId = `${record['business_product_id']}`;

    const { uuid: attractionUuid, uri: attractionUri } = uriGenerator.touristAttraction(recordId);

    store.add(sym(attractionUri), RDF('type'), SCHEMA('TouristAttraction'));
    store.add(sym(attractionUri), MU('uuid'), lit(attractionUuid));

    if (record['name']) {
      store.add(sym(attractionUri), SCHEMA('name'), lit(record['name'], 'nl'));
    }

    if (record['information_group']) {
      const type = informationGroupsMap[record['information_group']];
      if (type) {
        store.add(sym(attractionUri), RDF('type'), sym(type));
      } else {
        console.error(`Cannot map information group value '${record['information_group']}' for record ${recordId}`);
      }
    }

    if (record['discriminator']) {
      const type = productTypesMap[record['discriminator']];
      if (type) {
        store.add(sym(attractionUri), DCT('type'), sym(type));
      } else {
        console.error(`Cannot map discriminator value '${record['discriminator']}' for record ${recordId}`);
      }
    }

    if (record['sub_type']) {
      const type = productCategoriesMap[record['sub_type']];
      if (type) {
        store.add(sym(attractionUri), SCHEMA('keywords'), sym(type));
      } else {
        console.error(`Cannot map subtype value '${record['sub_type']}' for record ${recordId}`);
      }
    }

    if (record['location_type']) {
      const type = locationTypesMap[record['location_type']];
      if (type) {
        store.add(sym(attractionUri), SCHEMA('keywords'), sym(type));
      } else if (type === undefined) {
        console.error(`Cannot map location type value '${record['location_type']}' for record ${recordId}`);
      }
    }

    const tvlIdentifier = mapTvlIdentifier(recordId, record);
    store.add(sym(attractionUri), ADMS('identifier'), sym(tvlIdentifier.uri));
    store.addAll(tvlIdentifier.statements);

    try {
      const modified = new Date(record['changed_time']);
      store.add(sym(attractionUri), DCT('modified'), litDateTime(modified));
    } catch (_) {
      // Invalid or no changed_time
    }

    const address = mapAddress(recordId, record);
    if (address) {
      store.add(sym(attractionUri), LOCN('address'), sym(address.uri));
      store.addAll(address.statements);
    }

    const location = mapLocation(recordId, record);
    if (location) {
      store.add(sym(attractionUri), LOCN('geometry'), sym(location.uri));
      store.addAll(location.statements);
    }

    const touristicRegion = mapTouristicRegion(recordId, record);
    if (touristicRegion) {
      store.add(sym(attractionUri), LOGIES('behoortTotToeristischeRegio'), sym(touristicRegion.uri));
    }

    const statsRegion = mapStatisticalRegion(recordId, record);
    if (statsRegion) {
      store.add(sym(attractionUri), TVL('belongsToStatisticalRegion'), sym(statsRegion.uri));
    }

    const contactPoints = mapContactPoints(recordId, record);
    contactPoints.forEach((contactPoint) => {
      store.add(sym(attractionUri), SCHEMA('contactPoint'), sym(contactPoint.uri));
      store.addAll(contactPoint.statements);
    });

    const mediaObjects = mapMediaObjects(recordId, record);
    mediaObjects.forEach((mediaObject) => {
      store.add(sym(attractionUri), LOGIES('heeftMedia'), sym(mediaObject.uri));
      store.addAll(mediaObject.statements);
    });

    const mainMediaObjects = mapMainMediaObjects(recordId, record);
    mainMediaObjects.forEach((mediaObject) => {
      store.add(sym(attractionUri), SCHEMA('image'), sym(mediaObject.uri));
      store.addAll(mediaObject.statements);
    });

    const accessibilityLabel = mapAccessibilityLabel(recordId, record);
    if (accessibilityLabel) {
      store.add(sym(attractionUri), LOGIES('heeftKwaliteitslabel'), sym(accessibilityLabel.uri));
      store.addAll(accessibilityLabel.statements);
    }

    const greenLabel = mapGreenLabel(recordId, record);
    if (greenLabel) {
      store.add(sym(attractionUri), LOGIES('heeftKwaliteitslabel'), sym(greenLabel.uri));
      store.addAll(greenLabel.statements);
    }

    const accessibilityInformation = mapAccessibilityInformation(recordId, record);
    if (accessibilityInformation) {
      store.add(sym(accessibilityInformation.uri), DCT('subject'), sym(attractionUri));
      store.addAll(accessibilityInformation.statements);
    }

    if (record['reservations']) {
      store.add(sym(attractionUri), SCHEMA('acceptsReservations'), lit(record['reservations']));
    }

    for (const translation of translations) {
      const translationRecord = translation.records.find((record) => record['business_product_id'] == recordId);
      if (translationRecord) {
        mapTranslation(translation.lang, store, recordId, translationRecord, attractionUri);
      }
    }
  });

  return store.toNT();
}
