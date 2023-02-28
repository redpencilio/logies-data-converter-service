import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { tvlOrganizationUri, comfortClasses } from './codelists';
import { MU, RDF, SCHEMA } from './prefixes';

function mapRatings(recordId, record, errorLogger) {
  return ['comfort_class', 'tva_acknowledgement']
    .filter((field) => record[field])
    .map((field) => {
      const value = record[field];
      const rating = comfortClasses[value];

      if (rating) {
        const { uuid, uri } = uriGenerator.rating(recordId, field);
        const worstRating = comfortClasses[rating.scale.worstRating].label;
        const bestRating = comfortClasses[rating.scale.bestRating].label;
        const statements = [
          new Statement(sym(uri), RDF('type'), SCHEMA('Rating')),
          new Statement(sym(uri), MU('uuid'), lit(uuid)),
          new Statement(sym(uri), SCHEMA('ratingValue'), lit(rating.label)),
          new Statement(sym(uri), SCHEMA('worstRating'), lit(worstRating)),
          new Statement(sym(uri), SCHEMA('bestRating'), lit(bestRating)),
          new Statement(sym(uri), SCHEMA('author'), sym(tvlOrganizationUri)),
        ];
        return { uri, statements };
      } else if (!Object.keys(comfortClasses).includes(value)) {
        errorLogger(field, value, recordId);
      }
      return null;
    }).filter((rating) => rating);
}

export {
  mapRatings
}
