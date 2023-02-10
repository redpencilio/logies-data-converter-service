import { sym, lit } from 'rdflib';
import { DCT, LOGIES, SCHEMA } from './prefixes';
import { mapProductDescriptions, mapAccessibilityDescription } from './description';
import { mapAccessibilityInformation } from './accessibility';

function mapTranslation(lang, store, recordId, record, attractionUri) {
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

export {
  mapTranslation
}
