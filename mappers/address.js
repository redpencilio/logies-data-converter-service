import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { hasAnyProp, hasEveryProp } from '../helpers';
import { ADRES, GEOSPARQL, LOCN, MU, RDF, SCHEMA, WGS } from './prefixes';
import { touristicRegionMap } from './codelists';

function mapAddress(recordId, record) {
  if (hasAnyProp(record, ['street', 'house_number', 'box_number', 'postal_code', 'main_city_name'])) {
    const { addressUuid, addressUri } = uriGenerator.address(recordId);

    const statements = [
      new Statement(sym(addressUri), RDF('type'), LOCN('Address')),
      new Statement(sym(addressUri), MU('uuid'), lit(addressUuid)),
      new Statement(sym(addressUri), ADRES('land'), lit('België', 'nl')),
      new Statement(sym(addressUri), ADRES('land'), lit('Belgium', 'en')),
    ];

    if (record['street']) {
      statements.push(new Statement(sym(addressUri), LOCN('thoroughfare'), lit(record['street'])));
    }

    if (record['house_number']) {
      statements.push(new Statement(sym(addressUri), ADRES('Adresvoorstelling.huisnummer'), lit(record['house_number'])));
    }

    if (record['box_number']) {
      statements.push(new Statement(sym(addressUri), ADRES('Adresvoorstelling.busnummer'), lit(record['box_number'])));
    }

    if (record['postal_code']) {
      statements.push(new Statement(sym(addressUri), LOCN('postCode'), lit(record['postal_code'])));
    }

    if (record['main_city_name']) {
      statements.push(new Statement(sym(addressUri), ADRES('gemeentenaam'), lit(record['main_city_name'], 'nl')));
    }

    return { uri: addressUri, statements };
  } else {
    return null;
  }
}

function mapLocation(recordId, record) {
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

function mapTouristicRegion(recordId, record) {
  if (record['promotional_region']) {
    const touristicRegionUri = touristicRegionMap[record['promotional_region']];
    if (touristicRegionUri) {
      return { uri: touristicRegionUri };
    } else {
      console.error(`Cannot map promotional region value '${record['promotional_region']}' for record ${recordId}`);
    }
  }
  return null;
}

export {
  mapAddress,
  mapLocation,
  mapTouristicRegion
}
