import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { hasAnyProp, hasEveryProp } from '../helpers';
import { ADRES, GEOSPARQL, LOCN, MU, RDF, SCHEMA, WGS } from './prefixes';
import { touristicRegionMap } from './codelists';

function mapAddress(recordId, record, errorLogger, field_prefix = '', field_postfix = '') {
  if (hasAnyProp(record, ['street', 'house_number', 'box_number', 'postal_code', 'city_name', 'main_city_name'].map((k) => `${field_prefix}${k}${field_postfix}`))) {
    const type = field_prefix == '' ? null : field_prefix;
    const { addressUuid, addressUri } = uriGenerator.address(recordId, type);

    const statements = [
      new Statement(sym(addressUri), RDF('type'), LOCN('Address')),
      new Statement(sym(addressUri), MU('uuid'), lit(addressUuid)),
      new Statement(sym(addressUri), ADRES('land'), lit('België', 'nl')),
      new Statement(sym(addressUri), ADRES('land'), lit('Belgium', 'en')),
    ];

    if (record[`${field_prefix}street${field_postfix}`]) {
      statements.push(new Statement(sym(addressUri), LOCN('thoroughfare'), lit(record[`${field_prefix}street${field_postfix}`])));
    }

    if (record[`${field_prefix}house_number${field_postfix}`]) {
      statements.push(new Statement(sym(addressUri), ADRES('Adresvoorstelling.huisnummer'), lit(record[`${field_prefix}house_number${field_postfix}`])));
    }

    if (record[`${field_prefix}box_number${field_postfix}`]) {
      statements.push(new Statement(sym(addressUri), ADRES('Adresvoorstelling.busnummer'), lit(record[`${field_prefix}box_number${field_postfix}`])));
    }

    if (record[`${field_prefix}postal_code${field_postfix}`]) {
      statements.push(new Statement(sym(addressUri), LOCN('postCode'), lit(record[`${field_prefix}postal_code${field_postfix}`])));
    }

    if (record[`${field_prefix}city_name${field_postfix}`] && record[`${field_prefix}city_name${field_postfix}`] != record[`${field_prefix}main_city_name${field_postfix}`]) {
      statements.push(new Statement(sym(addressUri), ADRES('gemeentenaam'), lit(record[`${field_prefix}city_name${field_postfix}`], 'nl')));
    }

    if (record[`${field_prefix}main_city_name${field_postfix}`]) {
      statements.push(new Statement(sym(addressUri), ADRES('gemeentenaam'), lit(record[`${field_prefix}main_city_name${field_postfix}`], 'nl')));
    }

    return { uri: addressUri, statements };
  } else {
    return null;
  }
}

function mapLocation(recordId, record,errorLogger) {
  let statements = [];

  const { uuid: pointUuid, uri: pointUri } = uriGenerator.geometry(recordId);

  if (hasEveryProp(record, ['x', 'y'])) {
    const asGml = `<gml:Point gml:id="${recordId}" srsName="http://www.opengis.net/def/crs/EPSG/0/31370"><gml:pos srsDimension="2">${record['x']} ${record['y']}</gml:pos></gml:Point>`;
    statements = [
      new Statement(sym(pointUri), GEOSPARQL('asGML'), lit(asGml)),
      ...statements
    ];
  }

  if (hasEveryProp(record, ['lat', 'long'])) {
    const asWkt = `POINT (${record['long']} ${record['lat']})`;
    statements = [
      new Statement(sym(pointUri), GEOSPARQL('asWKT'), lit(asWkt)),
      new Statement(sym(pointUri), WGS('lat'), lit(record['lat'])),
      new Statement(sym(pointUri), WGS('long'), lit(record['long'])),
      ...statements
    ];

  }

  if (statements.length) { // either x,y and/or lat,long is set
    statements = [
      new Statement(sym(pointUri), RDF('type'), WGS('Point')),
      new Statement(sym(pointUri), RDF('type'), LOCN('Geometry')),
      new Statement(sym(pointUri), MU('uuid'), lit(pointUuid)),
      ...statements
    ];
    return { uri: pointUri, statements };
  } else {
    return null;
  }
}

function mapTouristicRegion(recordId, record,errorLogger, field = 'promotional_region') {
  if (record[field]) {
    const regionUri = touristicRegionMap[record[field]];
    if (regionUri) {
      return { uri: regionUri };
    } else {
      errorLogger(`Cannot map ${field} value '${record[field]}' for record ${recordId}`);
    }
  }
  return null;
}

function mapStatisticalRegion(recordId, record) {
  return mapTouristicRegion(recordId, record, 'statistical_region');
}

export {
  mapAddress,
  mapLocation,
  mapTouristicRegion,
  mapStatisticalRegion,
}
