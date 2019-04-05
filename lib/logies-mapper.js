import {
  sparqlEscapeUri,
  sparqlEscapeString,
  sparqlEscapeFloat,
  sparqlEscapeInt
} from 'mu';
import {
  tvlOrganizationUri,
  goodplanetOrganizationUri,
  registrationStatusMap,
  registrationTypeMap,
  touristicRegionMap,
  nonStandardizedUnitMap,
  comfortClasses,
  accessibilityLabels
} from './codelists';
import { generator } from './uri-helpers';
import { ttlPrefixes } from './prefixes';

const toTtl = function(statements) {
  console.log(`Mapped ${statements.length} rows`);
  const data = statements.join('');
  const ttl = `${ttlPrefixes}\n${data}`;
  return ttl;
};

const mapBaseRegistry = function(records) {
  const statements = records.map(function(record) {
    const recordId = `${record['business_product_id']}`;

    const lodgingUuid = generator.lodgingUuid(recordId);
    const lodgingUri = generator.lodgingUri(lodgingUuid);

    const lodgingIdentifierUuid = generator.lodgingIdentifierUuid(recordId);
    const lodgingIdentifierUri = generator.identifierUri(lodgingIdentifierUuid);

    let insert = `
        ${sparqlEscapeUri(lodgingUri)} a logies:Logies ;
            mu:uuid ${sparqlEscapeString(lodgingUuid)} ;
            schema:name ${sparqlEscapeString(record['name'])}@nl ;
            adms:identifier ${sparqlEscapeUri(lodgingIdentifierUri)} .
        ${sparqlEscapeUri(lodgingIdentifierUri)} a adms:Identifier ;
            mu:uuid ${sparqlEscapeString(lodgingIdentifierUuid)} ;
            skos:notation ${sparqlEscapeString(recordId)} ;
            adms:schemaAgency "Toerisme Vlaanderen" ;
            dct:creator ${sparqlEscapeUri(tvlOrganizationUri)} .
        `;

    insert += mapRegistration(recordId, record, lodgingUri);

    insert += mapAlternateExploitations(recordId, record, lodgingUri);

    if (record['name'] != record['name_or_number'])
      insert += `${sparqlEscapeUri(lodgingUri)} schema:alternativeName ${sparqlEscapeString(record['name_or_number'])}@nl . `;

    if (record['number_of_units'])
      insert += `${sparqlEscapeUri(lodgingUri)} logies:aantalVerhuureenheden ${sparqlEscapeInt(record['number_of_units'])} . `;

    if (record['maximum_capacity'])
      insert += `${sparqlEscapeUri(lodgingUri)} logies:aantalSlaapplaatsen ${sparqlEscapeInt(record['maximum_capacity'])} . `;
    if (record['tva_capacity'])
      insert += `${sparqlEscapeUri(lodgingUri)} logies:aantalSlaapplaatsen ${sparqlEscapeInt(record['tva_capacity'])} . `;

    insert += mapTouristicRegion(recordId, record, lodgingUri);

    insert += mapRating(recordId, record, lodgingUri, 'comfort_class');
    insert += mapRating(recordId, record, lodgingUri, 'tva_acknowledgement');

    insert += mapLocation(recordId, record, lodgingUri);

    if (record['street'] || record['house_number'] || record['box_number'] || record['postal_code'] || record['main_city_name'])
      insert += mapAddress(recordId, record, lodgingUri);

    insert += mapCapacities(recordId, record, lodgingUri);

    insert += mapContactPoints(recordId, record, lodgingUri);

    insert += mapGreenlabel(recordId, record, lodgingUri);

    insert += mapAccessibilityLabel(recordId, record, lodgingUri);

    return insert;
  });

  return toTtl(statements);
};

const mapPromotionalInfo = function(records) {
  const statements = records
    .map(function(record) {
      const recordId = `${record['business_product_id']}`;
      const lodgingUuid = generator.lodgingUuid(recordId);
      const lodgingUri = generator.lodgingUri(lodgingUuid);

      let insert = '';

      insert += mapDescription(recordId, record, lodgingUri);

      insert += mapMediaObjects(recordId, record, lodgingUri);

      return insert;
    });
  return toTtl(statements);
};

const mapRegistration = function(recordId, record, lodgingUri) {

  const isLogiesDecreet = ['ACKNOWLEDGED', 'LICENSED', 'NOTIFIED'].includes(record['status']);
  const isTVA = ['A', 'B', 'C', 'TVA', 'HOSTEL'].includes(record['tva_acknowledgement']);

  if (!isLogiesDecreet && !isTVA)
    console.log(`Lodging ${recordId} cannot be categorized in Logies decree nor in TVA decree.
                 Status: ${record['status']} and TVA acknowlodgement ${record['tva_acknowledgement']}`);
  else if (isLogiesDecreet && isTVA)
    console.log(`Lodging ${recordId} is categorized as both Logies decree and TVA decree`);

  const insertRegistration = function(lodgingUri, decree, type, status, issuedDate) {
    const registrationUuid = generator.registrationUuid(recordId, decree);
    const registrationUri = generator.registrationUri(registrationUuid);

    const registrationIdentifierUuid = generator.registrationIdentifierUuid(recordId, decree);
    const registrationIdentifierUri = generator.identifierUri(registrationIdentifierUuid);

    let insert = `
      ${sparqlEscapeUri(lodgingUri)} logies:heeftRegistratie ${sparqlEscapeUri(registrationUri)} .
      ${sparqlEscapeUri(registrationUri)} a logies:Registratie ;
          mu:uuid ${sparqlEscapeString(registrationUuid)} ;
          adms:identifier ${sparqlEscapeUri(registrationIdentifierUri)} ;
          logies:verantwoordelijkeOrganisatie ${sparqlEscapeUri(tvlOrganizationUri)} .
      ${sparqlEscapeUri(registrationIdentifierUri)} a adms:Identifier ;
          mu:uuid ${sparqlEscapeString(registrationIdentifierUuid)} ;
          skos:notation ${sparqlEscapeString(recordId)} ;
          adms:schemaAgency "Toerisme Vlaanderen" ;
          dct:creator ${sparqlEscapeUri(tvlOrganizationUri)} .
      `;

    const registrationTypeUri = registrationTypeMap[type];
    if (registrationTypeUri)
      insert += ` ${sparqlEscapeUri(registrationUri)} ext:tvlCategory ${sparqlEscapeUri(registrationTypeUri)} . `;
      // dct:type is added by a postprocess query based on ext:tvlCategory

    const registrationStatusUri = registrationStatusMap[status];
    if (registrationStatusUri)
      insert += ` ${sparqlEscapeUri(registrationUri)} logies:registratieStatus ${sparqlEscapeUri(registrationStatusUri)} . `;

    if (issuedDate)
      insert += ` ${sparqlEscapeUri(registrationUri)} dct:issued "${issuedDate}"^^xsd:dateTime . `;

    return insert;
  };

  const normalizeDate = function(value) {
    return value && Array.isArray(value) ? value[0] : value;
  };

  let insert = '';

  if (isLogiesDecreet) {
    const decree = 'logiesDecreet';
    const status = record['status'];
    const type = record['discriminator'];

    let issuedDate = null;
    if (status == 'LICENSED') // licensed according to the old decree
      issuedDate = record['last_status_change_date'];
    else if (status == 'NOTIFIED') // notified/aangemeld according to logiesdecreet
      issuedDate = record['notification_date'];
    else if (status == 'ACKNOWLEDGED') // acknowledged/erkend according to logiesdecreet.
      issuedDate = record['acknowledgement_date'];

    insert += insertRegistration(lodgingUri, decree, type, status, normalizeDate(issuedDate));
  }

  if (isTVA) {
    const decree = 'tvaDecreet';
    const status = record['tva_acknowledgement'];
    const type = record['discriminator'];
    const issuedDate = record['tva_acknowledgement_date'];
    insert += insertRegistration(lodgingUri, decree, type, status, normalizeDate(issuedDate));
  }

  return insert;
};

const mapAlternateExploitations = function(recordId, record, lodgingUri) {
  let insert = '';

  if (record['product_type'] == 'PROMO') {
    const parents = (record['parent_product_ids'] || '').split(',');

    if (parents && parents.length) {
      const parentLodgingUris = parents.map(id => generator.lodgingUri(generator.lodgingUuid(id)));

      parentLodgingUris.forEach(function(parentUri) {
        insert += `
          ${sparqlEscapeUri(parentUri)} logies:heeftAlternatieveUitbating ${sparqlEscapeUri(lodgingUri)} .
        `;
      });
    } else {
      console.error(`Cannot map product_type 'PROMO' without parent_product_ids for record ${recordId}`);
    }
  }

  return insert;
};

const mapLocation = function(recordId, record, lodgingUri) {
  const pointUuid = generator.geometryUuid(recordId);
  const pointUri = generator.geometryUri(pointUuid);

  let insert = `
        ${sparqlEscapeUri(lodgingUri)} logies:onthaalLocatie ${sparqlEscapeUri(pointUri)} .
        ${sparqlEscapeUri(pointUri)} a wgs:Point, locn:Geometry;
          mu:uuid ${sparqlEscapeString(pointUuid)} .
  `;

  if (record['x'] && record['y']) {
    const asGml = `<gml:Point gml:id="${recordId}" srsName="http://www.opengis.net/def/crs/EPSG/0/31370"><gml:pos srsDimension="2">${record['x']} ${record['y']}</gml:pos></gml:Point>`;
    insert += ` ${sparqlEscapeUri(pointUri)} geosparql:asGML """${asGml}""" . \n`;
  }

  if (record['long'] && record['lat']) {
    const asWkt = `POINT (${record['long']} ${record['lat']})`;
    insert += ` ${sparqlEscapeUri(pointUri)} geosparql:asWKT ${sparqlEscapeString(asWkt)} ;
          wgs:lat ${sparqlEscapeFloat(record['lat'])} ;
          wgs:long ${sparqlEscapeFloat(record['long'])} .
    `;
  }

  return insert;
};

const mapAddress = function(recordId, record, lodgingUri) {
  const addressUuid = generator.addressUuid(recordId);
  const addressUri = generator.addressUri(addressUuid);

  const properties = [];

  if (record['street'])
    properties.push(`locn:thoroughfare ${sparqlEscapeString(record['street'])} `);

  if (record['house_number'])
    properties.push(`adres:Adresvoorstelling.huisnummer ${sparqlEscapeString(record['house_number'])} `);

  if (record['box_number'])
    properties.push(`adres:Adresvoorstelling.busnummer ${sparqlEscapeString(record['box_number'])} `);

  if (record['postal_code'])
    properties.push(`locn:postCode ${sparqlEscapeString(record['postal_code'])} `);

  if (record['main_city_name'])
    properties.push(`adres:gemeentenaam ${sparqlEscapeString(record['main_city_name'])}@nl `);

  properties.push(`adres:land ${sparqlEscapeString('België')}@nl, ${sparqlEscapeString('Belgium')}@en `);

  return `${sparqlEscapeUri(addressUri)} a locn:Address ; mu:uuid ${sparqlEscapeString(addressUuid)} ;
              ${properties.join('; ')} .
          ${sparqlEscapeUri(lodgingUri)} logies:onthaalAdres ${sparqlEscapeUri(addressUri)} .
  `;
};

const mapCapacities = function(recordId, record, lodgingUri) {
  const columns = [
    'number_of_short_term_camping_spots',
    'number_of_touristic_camping_spots',
    'number_of_camper_stands',
    'number_of_camping_spots',
    'number_of_residence_units',
    'number_of_long_term_camping_spots',
    'number_of_residence_units_for_rental',
    'number_of_hikers_huts'
  ];

  let insert = '';

  columns.forEach(function(key) {
    if (record[key]) {
      const value = `${record[key]}`;

      const unit = nonStandardizedUnitMap[key];
      const quantitativeValueUuid = generator.quantitativeValueUuid(recordId, unit);
      const quantitativeValueUri = generator.quantitativeValueUri(quantitativeValueUuid);

      insert += `
        ${sparqlEscapeUri(lodgingUri)} logies:capaciteit ${sparqlEscapeUri(quantitativeValueUri)} .
        ${sparqlEscapeUri(quantitativeValueUri)} a schema:QuantitativeValue ;
          mu:uuid ${sparqlEscapeString(quantitativeValueUuid)} ;
          schema:value ${sparqlEscapeString(value)} ;
          schema:unitText ${sparqlEscapeString(unit)}@nl .
      `;

    }
  });

  return insert;
};

const mapTouristicRegion =  function(recordId, record, lodgingUri) {
  const touristicRegionUri = touristicRegionMap[record['promotional_region']];

  if (record['promotional_region']) {
    if (touristicRegionUri)
      return ` ${sparqlEscapeUri(lodgingUri)} logies:behoortTotToeristischeRegio <${touristicRegionUri}> .\n `;
    else if (!Object.keys(touristicRegionMap).includes(record['promotional_region']))
      console.error(`Cannot map value '${record['promotional_region']}' in promotional_region column for record ${recordId}`);
  }

  return '';
};

const mapRating = function(recordId, record, lodgingUri, field = 'comfort_class') {
  if (record[field]) {
    const ratingUuid = generator.ratingUuid(recordId, field);
    const ratingUri = generator.ratingUri(ratingUuid);

    const rating = comfortClasses[record[field]];

    if (rating) {
      const worstRating = comfortClasses[rating.scale.worstRating].label;
      const bestRating = comfortClasses[rating.scale.bestRating].label;

      return `
        ${sparqlEscapeUri(lodgingUri)} schema:starRating ${sparqlEscapeUri(ratingUri)} .
        ${sparqlEscapeUri(ratingUri)} a schema:Rating ;
          mu:uuid ${sparqlEscapeString(ratingUuid)} ;
          schema:ratingValue ${sparqlEscapeString(rating.label)} ;
          schema:worstRating ${sparqlEscapeString(worstRating)} ;
          schema:bestRating ${sparqlEscapeString(bestRating)} ;
          schema:author ${sparqlEscapeUri(tvlOrganizationUri)} .
      `;
    } else if (!Object.keys(comfortClasses).includes(record[field])) {
      console.error(`Cannot map value '${record[field]}' in ${field} column for record ${recordId}`);
    }
  }

  return '';
};

const mapGreenlabel = function(recordId, record, lodgingUri) {
  const labelUuid = generator.qualityLabelUuid(recordId, 'green-label');
  const labelUri = generator.qualityLabelUri(labelUuid);

  // TODO add quality-label code as skos:Concept
  if (record['green_key_labeled'])
    return `
        ${sparqlEscapeUri(lodgingUri)} logies:heeftKwaliteitslabel ${sparqlEscapeUri(labelUri)} .
        ${sparqlEscapeUri(labelUri)} a logies:Kwaliteitslabel ;
          mu:uuid ${sparqlEscapeString(labelUuid)} ;
          skos:prefLabel \"Green Key\"@nl, \"Green Key\"@en ;
          schema:author ${sparqlEscapeUri(goodplanetOrganizationUri)} .
    `;

  return '';
};

const mapAccessibilityLabel = function(recordId, record, lodgingUri) {
  if (record['accessibility_label']) {
    const labelUuid = generator.qualityLabelUuid(recordId, 'accessibility');
    const labelUri = generator.qualityLabelUri(labelUuid);

    const accessibility = accessibilityLabels[record['accessibility_label']];

    if (accessibility)
      // TODO add quality-label code as skos:Concept
      return `
        ${sparqlEscapeUri(lodgingUri)} logies:heeftKwaliteitslabel ${sparqlEscapeUri(labelUri)} .
        ${sparqlEscapeUri(labelUri)} a logies:Kwaliteitslabel ;
          mu:uuid ${sparqlEscapeString(labelUuid)} ;
          skos:prefLabel ${sparqlEscapeString(accessibility)}@nl ;
          schema:author ${sparqlEscapeUri(tvlOrganizationUri)} .
      `;
    else if (!Object.keys(accessibilityLabels).includes(record['accessibility_label']))
      console.error(`Cannot map value '${record['accessibility_label']}' in accessibility_label column for record ${recordId}`);
  }

  return '';
};

const mapContactPoints = function(recordId, record, lodgingUri) {
  const columns = [
    'phone1',
    'phone2',
    'phone3',
    'email',
    'website'
  ];

  let insert = '';

  columns.forEach(function(key) {
    const value = record[key] && record[key].trim();

    if (value) {
      const contactPointUuid = generator.contactPointUuid(recordId, key);
      const contactPointUri = generator.contactPointUri(contactPointUuid);

      insert += `
        ${sparqlEscapeUri(lodgingUri)} schema:contactPoint ${sparqlEscapeUri(contactPointUri)} .
        ${sparqlEscapeUri(contactPointUri)} a schema:ContactPoint ;
          mu:uuid ${sparqlEscapeString(contactPointUuid)} .
      `;

      if (key.startsWith('phone'))
        insert += `${sparqlEscapeUri(contactPointUri)} schema:telephone ${sparqlEscapeString(value)} . `;
      else if (key == 'email')
        insert += `${sparqlEscapeUri(contactPointUri)} schema:email ${sparqlEscapeString(value)} . `;
      if (key == 'website') {
        const validUrlRegex = /^[\da-zA-Z-\\\.:\/?=_%&#+@]*$/g; // /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
        if (validUrlRegex.test(value)) {
          insert += `${sparqlEscapeUri(contactPointUri)} foaf:page ${sparqlEscapeUri(value)} . `;
        } else {
          console.error(`Cannot map invalid website URL '${value}' in ${key} column for record ${recordId}`);
          insert = '';
        }
      }
    }
  });

  return insert;
};

const mapDescription = function(recordId, record, lodgingUri) {
  if (record['product_description_nl'] || record['product_description_en']) {
    const descriptionUuid = generator.descriptionUuid(recordId);
    const descriptionUri = generator.descriptionUri(descriptionUuid);

    let insert = `
        ${sparqlEscapeUri(lodgingUri)} logies:heeftBeschrijving ${sparqlEscapeUri(descriptionUri)} .
        ${sparqlEscapeUri(descriptionUri)} a logies:Beschrijving ;
          mu:uuid ${sparqlEscapeString(descriptionUuid)} .
    `;

    if (record['product_description_nl'])
      insert += `${sparqlEscapeUri(descriptionUri)} schema:value ""${sparqlEscapeString(record['product_description_nl'])}""@nl .`;
    if (record['product_description_en'])
      insert += `${sparqlEscapeUri(descriptionUri)} schema:value ""${sparqlEscapeString(record['product_description_en'])}""@en .`;

    return insert;
  } else {
    return '';
  }
};

const mapMediaObjects = function(recordId, record, lodgingUri) {
  const mediaObjects = (record['imagesurl'] || '').split(',');

  return mediaObjects.map(function(contentUrl) {
    const value = contentUrl.trim();

    if (value) {
      const validUrlRegex = /^[\da-zA-Z-\\\.:\/?=_%&#+@]*$/g; // /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
      if (validUrlRegex.test(value)) {
        const mediaObjectUuid = generator.mediaObjectUuid(recordId, contentUrl);
        const mediaObjectUri = generator.mediaObjectUri(mediaObjectUuid);

        return `
          ${sparqlEscapeUri(lodgingUri)} logies:heeftMedia ${sparqlEscapeUri(mediaObjectUri)} .
          ${sparqlEscapeUri(mediaObjectUri)} a schema:MediaObject ;
            mu:uuid ${sparqlEscapeString(mediaObjectUuid)} ;
            schema:contentUrl ${sparqlEscapeUri(value)} .
      `;
      } else {
        console.error(`Cannot map invalid image URL '${value}' in imagesurl column for record ${recordId}`);
      }
    }

    return '';
  }).join('');
};

export {
  mapBaseRegistry,
  mapPromotionalInfo
};
