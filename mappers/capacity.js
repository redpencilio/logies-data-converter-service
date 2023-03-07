import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { nonStandardizedUnitMap } from './codelists';
import { MU, RDF, SCHEMA } from './prefixes';

function mapCapacities(recordId, record) {
  const capacities = [];
  [
    'number_of_short_term_camping_spots',
    'number_of_touristic_camping_spots',
    'number_of_camper_stands',
    'number_of_camping_spots',
    'number_of_residence_units',
    'number_of_long_term_camping_spots',
    'number_of_residence_units_for_rental',
    'number_of_hikers_huts'
  ].forEach((field) => {
    if (record[field]) {
      const value = `${record[field]}`;

      const unit = nonStandardizedUnitMap[field];
      const { uuid, uri } = uriGenerator.quantitativeValue(recordId, unit);

      const statements = [
        new Statement(sym(uri), RDF('type'), SCHEMA('QuantitativeValue')),
        new Statement(sym(uri), MU('uuid'), lit(uuid)),
        new Statement(sym(uri), SCHEMA('value'), lit(value)),
        new Statement(sym(uri), SCHEMA('unitText'), lit(unit, 'nl')),
      ];

      capacities.push({ uri, statements });
    }
  });
  return capacities;
}

function mapPropertyValues(recordId, record) {
  const propertyValues = [];
  [
    'tva_capacity_description'
  ].forEach((field) => {
    if (record[field]) {
      const value = `${record[field]}`;

      const unit = nonStandardizedUnitMap[field];
      const { uuid, uri } = uriGenerator.quantitativeValue(recordId, unit);

      const statements = [
        new Statement(sym(uri), RDF('type'), SCHEMA('PropertyValue')),
        new Statement(sym(uri), MU('uuid'), lit(uuid)),
        new Statement(sym(uri), SCHEMA('value'), lit(value)),
        new Statement(sym(uri), SCHEMA('unitText'), lit(unit, 'nl')),
      ];

      propertyValues.push({ uri, statements });
    }
  });
  return propertyValues;
}

export {
  mapCapacities,
  mapPropertyValues
}
