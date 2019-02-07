import {
  sparqlEscapeUri,
  sparqlEscapeString,
  sparqlEscapeFloat,
  sparqlEscapeInt
} from 'mu';
import {
  tvlOrganizationUri,
  registrationStatusMap,
  registrationTypeMap,
  touristicRegionMap,
  nonStandardizedUnitMap,
  comfortClasses
} from './codelists';
import {
  generateRegistrationUuid,
  generateRegistrationUri,
  generateLodgingUuid,
  generateLodgingUri,
  generateRegistrationIdentifierUuid,
  generateLodgingIdentifierUuid,
  generateIdentifierUri,
  generatePointUuid,
  generatePointUri,
  generateAddressUuid,
  generateAddressUri,
  generateQuantitativeValueUuid,
  generateQuantitativeValueUri,
  generateRatingUuid,
  generateRatingUri,
  generateContactPointUuid,
  generateContactPointUri
} from './uri-helpers';
import { ttlPrefixes } from './prefixes';

const toTtl = function(statements) {
  console.log(`Mapped ${statements.length} rows`);
  const data = statements.join('');
  const ttl = `${ttlPrefixes}\n${data}`;
  return ttl;
};

const mapTvaRegistry = function(records) {
  const statements = records
    .filter(r => r['deleted'] == '0' && ['A', 'B', 'C'].includes(r['tva_acknowledgement']))
    .map(function(record) {
      const recordId = record['business_product_id'];

      const lodgingUuid = generateLodgingUuid(recordId);
      const lodgingUri = generateLodgingUri(lodgingUuid);

      const lodgingIdentifierUuid = generateLodgingIdentifierUuid(recordId);
      const lodgingIdentifierUri = generateIdentifierUri(lodgingIdentifierUuid);

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

      if (record['name'] != record['name_or_number'])
        insert += `${sparqlEscapeUri(lodgingUri)} schema:alternativeName ${sparqlEscapeString(record['name_or_number'])}@nl . `;

      if (record['tva_capacity'])
        insert += `${sparqlEscapeUri(lodgingUri)} logies:aantalSlaapplaatsen ${sparqlEscapeInt(record['tva_capacity'])} . `;

      if (record['promotional_region'])
        insert += mapTouristicRegion(recordId, record, lodgingUri);

      if (record['comfort_class'])
        insert += mapRating(recordId, record, lodgingUri);

      if (record['lat'] && record['long'])
        insert += mapLocation(recordId, record, lodgingUri);

      if (record['street'] || record['house_number'] || record['box_number'] || record['postal_code'] || record['main_city_name'])
        insert += mapAddress(recordId, record, lodgingUri);

      insert += mapContactPoints(recordId, record, lodgingUri);

      return insert;
    });
  return toTtl(statements);
};

const mapBaseRegistry = function(records) {
  const statements = records.map(function(record) {
    const recordId = record['business_product_id'];

    const lodgingUuid = generateLodgingUuid(recordId);
    const lodgingUri = generateLodgingUri(lodgingUuid);

    const lodgingIdentifierUuid = generateLodgingIdentifierUuid(recordId);
    const lodgingIdentifierUri = generateIdentifierUri(lodgingIdentifierUuid);

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

    if (record['name'] != record['name_or_number'])
      insert += `${sparqlEscapeUri(lodgingUri)} schema:alternativeName ${sparqlEscapeString(record['name_or_number'])}@nl . `;

    if (record['number_of_units'])
      insert += `${sparqlEscapeUri(lodgingUri)} logies:aantalVerhuureenheden ${sparqlEscapeInt(record['number_of_units'])} . `;

    if (record['maximum_capacity'])
      insert += `${sparqlEscapeUri(lodgingUri)} logies:aantalSlaapplaatsen ${sparqlEscapeInt(record['maximum_capacity'])} . `;

    if (record['promotional_region'])
      insert += mapTouristicRegion(recordId, record, lodgingUri);

    if (record['comfort_class'])
      insert += mapRating(recordId, record, lodgingUri);

    if (record['lat'] && record['long'])
      insert += mapLocation(recordId, record, lodgingUri);

    if (record['street'] || record['house_number'] || record['box_number'] || record['postal_code'] || record['main_city_name'])
      insert += mapAddress(recordId, record, lodgingUri);

    insert += mapCapacities(recordId, record, lodgingUri);

    insert += mapContactPoints(recordId, record, lodgingUri);

    return insert;
  });

  return toTtl(statements);
};

const mapRegistration = function(recordId, record, lodgingUri) {
  const registrationUuid = generateRegistrationUuid(recordId);
  const registrationUri = generateRegistrationUri(registrationUuid);

  const registrationIdentifierUuid = generateRegistrationIdentifierUuid(recordId);
  const registrationIdentifierUri = generateIdentifierUri(registrationIdentifierUuid);

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

  const registrationStatusUri = registrationStatusMap[record['status']];
  if (registrationStatusUri)
    insert += ` ${sparqlEscapeUri(registrationUri)} logies:registratieStatus ${sparqlEscapeUri(registrationStatusUri)} . `;

  const registrationTypeUri = registrationTypeMap[record['discriminator']];
  if (registrationTypeUri)
    insert += ` ${sparqlEscapeUri(registrationUri)} dct:type ${sparqlEscapeUri(registrationTypeUri)} . `;


  if (record['product_type'] == 'PROMO') {
    const parents = record['parent_product_ids'].split(',');

    if (parents && parents.length) {
      const parentLodgingUris = parents.map(id => generateLodgingUri(generateLodgingUuid(id)));

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
  const pointUuid = generatePointUuid(recordId);
  const pointUri = generatePointUri(pointUuid);

  const asWkt = `POINT (${record['long']} ${record['lat']})`;
  return `
        ${sparqlEscapeUri(lodgingUri)} logies:onthaalLocatie ${sparqlEscapeUri(pointUri)} .
        ${sparqlEscapeUri(pointUri)} a wgs:Point ;
          mu:uuid ${sparqlEscapeString(pointUuid)} ;
          geosparql:asWKT ${sparqlEscapeString(asWkt)} ;
          wgs:lat ${sparqlEscapeFloat(record['lat'])} ;
          wgs:long ${sparqlEscapeFloat(record['long'])} .
      `;
};

const mapAddress = function(recordId, record, lodgingUri) {
  const addressUuid = generateAddressUuid(recordId);
  const addressUri = generateAddressUri(addressUuid);

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
    const value = record[key];

    if (value) {
      const unit = nonStandardizedUnitMap[key];
      const quantitativeValueUuid = generateQuantitativeValueUuid(recordId, unit);
      const quantitativeValueUri = generateQuantitativeValueUri(quantitativeValueUuid);

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

  if (touristicRegionUri) {
    return `
       ${sparqlEscapeUri(lodgingUri)} logies:behoortTotToeristischeRegio <${touristicRegionUri}> .
     `;
  } else {
    console.error(`Cannot map value '${record['promotional_region']}' in promotional_region column for record ${recordId}`);
    return '';
  }
};

const mapRating = function(recordId, record, lodgingUri) {
  const ratingUuid = generateRatingUuid(recordId);
  const ratingUri = generateRatingUri(ratingUuid);

  const rating = comfortClasses[record['comfort_class']];

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
          ext:ratingAuthor ${sparqlEscapeUri(tvlOrganizationUri)} .
      `;
  } else {
    console.error(`Cannot map value '${record['comfort_class']}' in comfort_class column for record ${recordId}`);
    return '';
  }
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
      const contactPointUuid = generateContactPointUuid(recordId, key);
      const contactPointUri = generateContactPointUri(contactPointUuid);

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

export {
  mapTvaRegistry,
  mapBaseRegistry
};
