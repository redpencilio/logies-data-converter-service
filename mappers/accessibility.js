import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { MU, RDF, SCHEMA, TVL, XSD } from './prefixes';

const properties = [
  { key: 'accessibility_description', predicate: SCHEMA('accessibilitySummary') },
  { key: 'experience', predicate: SCHEMA('description') },
  { key: 'experience_desc', predicate: SCHEMA('description') },
  { key: 'offer', predicate: SCHEMA('description') },
  { key: 'allergies_desc', predicate: TVL('informationAboutAllergies') },
  { key: 'allergies_description', predicate: TVL('informationAboutAllergies') },
  { key: 'appartement', predicate: TVL('informationAboutAppartement') },
  { key: 'bedroom', predicate: TVL('informationAboutBedroom') },
  { key: 'common_toilet', predicate: TVL('informationAboutCommonToiletFacilities') },
  { key: 'dining_room', predicate: TVL('informationAboutDiningRoom') },
  { key: 'exhibition_space', predicate: TVL('informationAboutExhibitionSpace') },
  { key: 'exhibition_space_desc', predicate: TVL('informationAboutExhibitionSpace') },
  { key: 'extra_facilities', predicate: TVL('informationAboutExtraFacilities') },
  { key: 'food_allergy_desc', predicate: TVL('informationAboutFoodAllergies') },
  { key: 'garden', predicate: TVL('informationAboutGarden') },
  { key: 'garden_desc', predicate: TVL('informationAboutGarden') },
  { key: 'living_space', predicate: TVL('informationAboutLivingSpace') },
  { key: 'accessibility_private_parking', predicate: TVL('informationAboutParking') },
  { key: 'accessibility_prive_parking_desc', predicate: TVL('informationAboutParking') },
  { key: 'pitch', predicate: TVL('informationAboutPitch') },
  { key: 'playground_desc', predicate: TVL('informationAboutPlayground') },
  { key: 'restaurant', predicate: TVL('informationAboutRestaurant') },
  { key: 'restaurant_or_breakfast_area', predicate: TVL('informationAboutRestaurant') },
  { key: 'resting_points_desc', predicate: TVL('informationAboutRestingPoints') },
  { key: 'bed_and_bathroom', predicate: TVL('informationAboutRoom') },
  { key: 'route_and_levels', predicate: TVL('informationAboutRouteAndLevels') },
  { key: 'shop_desc', predicate: TVL('informationAboutShop') },
  { key: 'space_table_desc', predicate: TVL('informationAboutTableSpace') },
  { key: 'sanitary_block', predicate: TVL('informationAboutToiletFacilities') },
  { key: 'auditive_desc', predicate: TVL('informationForAuditiveHandicap') },
  { key: 'hearing_impaired', predicate: TVL('informationForAuditiveHandicap') },
  { key: 'autism_desc', predicate: TVL('informationForAutism') },
  { key: 'blind_desc', predicate: TVL('informationForBlind') },
  { key: 'deaf_desc', predicate: TVL('informationForDeaf') },
  { key: 'mental_desc', predicate: TVL('informationForMentalHandicap') },
  { key: 'motor_desc', predicate: TVL('informationForMotoricalHandicap') },
  { key: 'motor_impaired', predicate: TVL('informationForMotoricalHandicap') },
  { key: 'visual_desc', predicate: TVL('informationForVisualHandicap') },
  { key: 'entrance', predicate: TVL('infromationAboutEntrances') },
  { key: 'extra_care_description', predicate: TVL('informationAboutExtraCare') },
  { key: 'allergies', predicate: TVL('supportForAllergies'), datatype: XSD('boolean') },
  { key: 'auditive', predicate: TVL('supportForAuditiveHandicap'), datatype: XSD('boolean') },
  { key: 'autism', predicate: TVL('supportForAutism'), datatype: XSD('boolean') },
  { key: 'blind', predicate: TVL('supportForBlind'), datatype: XSD('boolean') },
  { key: 'deaf', predicate: TVL('supportForDeaf'), datatype: XSD('boolean') },
  { key: 'extra_care', predicate: TVL('supportForExtraCare'), datatype: XSD('boolean') },
  { key: 'food_allergy', predicate: TVL('supportForFoodAllergies'), datatype: XSD('boolean') },
  { key: 'mental', predicate: TVL('supportForMentalHandicap'), datatype: XSD('boolean') },
  { key: 'motor', predicate: TVL('supportForMotoricalHandicap'), datatype: XSD('boolean') },
  { key: 'visual', predicate: TVL('supportForVisualHandicap'), datatype: XSD('boolean') },
  { key: 'visually_impaired', predicate: TVL('supportForVisualHandicap'), datatype: XSD('boolean') }
];

function mapAccessibilityInformation(recordId, record, lang) {
  const { uuid, uri } = uriGenerator.accessibilityInformation(recordId);
  const statements = [
    new Statement(sym(uri), RDF('type'), TVL('AccessibilityInformation')),
    new Statement(sym(uri), MU('uuid'), lit(uuid)),
  ];
  properties.forEach((property) => {
    const value = record[property.key];
    if (value) {
      const object = property.datatype ? lit(value, lang, property.datatype) : lit(value, lang);
      statements.push(new Statement(sym(uri), property.predicate, object));
    }
  });

  return { uri, statements };
}

export {
  mapAccessibilityInformation
}
