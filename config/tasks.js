import { mapBaseRegistry, mapPromotionalInfo } from '../lib/logies-mapper';

const noopMapper = function() { return ''; };

const descriptionQuery = function(lang) {
  return `
SELECT product_id as business_product_id, product_description as product_description_${lang}
FROM od_accommodation_touristic_translations('${lang}', '${lang}') as p
WHERE p.product_id IN (
  SELECT business_product_id
  FROM od_accommodation_base_registry
  WHERE (status in ('LICENSED', 'ACKNOWLEDGED', 'NOTIFIED') OR TVA_acknowledgement in ('A','B','C'))
  AND (street IS NOT NULL AND postal_code IS NOT NULL)
  AND deleted = 0
)
AND p.product_description IS NOT NULL
ORDER BY p.product_id`;
};

export default [
  {
    title: 'Accommodation base registry',
    inputFile: '/input/accommodation_base_registry.json',
    outputFile: '/tmp/accommodation_base_registry.ttl',
    query: `
SELECT business_product_id, legacy_tdb_subcategory_id, legacy_vlis_id, name, name_or_number, discriminator, product_type, parent_product_ids, street, house_number, box_number, city_name, main_city_name, promotional_region, statistical_region, x, y, lat, long, postal_code, phone1, phone2, phone3, email, website, last_status_change_date, notification_date, acknowledgement_date, status, tva_acknowledgement, comfort_class, number_of_units, maximum_capacity, number_of_short_term_camping_spots, number_of_touristic_camping_spots, number_of_camper_stands, number_of_camping_spots, number_of_residence_units, number_of_long_term_camping_spots, number_of_residence_units_for_rental, number_of_hikers_huts, partnerlabel_fod, fire_safety_certificate_expiration_date, fire_safety_advice, file_number, tva_type, tva_capacity, tva_capacity_old, tva_capacity_description, tva_acknowledgement_old, tva_acknowledgement_date, tva_principal_acknowledgement_date, tva_revoke_date, tva_suspension_date, tva_suspension_removal_date, product_owner_contact_id, product_owner_share_with_partners, product_owner_company_identification, product_owner_company_name, product_owner_title, product_owner_first_name, product_owner_last_name, product_owner_street, product_owner_house_number, product_owner_box_number, product_owner_city_name, product_owner_postal_code, product_owner_phone1, product_owner_phone2, product_owner_phone3, product_owner_email, product_owner_website, agent_contact_id, agent_share_with_partners, agent_company_identification, agent_company_name, agent_title, agent_first_name, agent_last_name, agent_street, agent_house_number, agent_box_number, agent_city_name, agent_postal_code, agent_phone1, agent_phone2, agent_phone3, agent_email, agent_website, product_owner_contact_id_fod, product_owner_company_identification_fod, product_owner_company_name_fod, product_owner_street_fod, product_owner_house_number_fod, product_owner_box_number_fod, product_owner_city_name_fod, product_owner_postal_code_fod, product_owner_phone1_fod, product_owner_phone2_fod, product_owner_phone3_fod, product_owner_email_fod, product_owner_website_fod, agent_contact_id_fod, agent_company_identification_fod, agent_company_name_fod, agent_street_fod, agent_house_number_fod, agent_box_number_fod, agent_city_name_fod, agent_postal_code_fod, agent_phone1_fod, agent_phone2_fod, agent_phone3_fod, agent_email_fod, agent_website_fod, tva_contact_contact_id, tva_contact_title, tva_contact_first_name, tva_contact_last_name, tva_contact_street, tva_contact_house_number, tva_contact_box_number, tva_contact_city_name, tva_contact_postal_code, tva_contact_phone1, tva_contact_phone2, tva_contact_phone3, tva_contact_email, tva_contact_website, tva_organization_contact_id, tva_organization_company_identification, tva_organization_company_name, tva_organization_street, tva_organization_house_number, tva_organization_box_number, tva_organization_city_name, tva_organization_postal_code, tva_organization_phone1, tva_organization_phone2, tva_organization_phone3, tva_organization_email, tva_organization_website, deleted, green_key_labeled, accessibility_label, changed_time FROM od_accommodation_base_registry
`,
    mapper: noopMapper
  },
  {
    title: 'Activity',
    inputFile: '/input/activity_accessibility.json',
    outputFile: '/tmp/activity_accessibility.ttl',
    query: `
SELECT business_product_id, source_id, discriminator, information_group, changed_time, deleted, name, street, house_number, box_number, city_name, main_city_name, postal_code, promotional_region, statistical_region, x, y, lat, long, phone1, flickr, facebook, email, instagram, fax, twitter, phone2, phone3, website, sub_type, green_key_labeled, accessibility_label, link_to_accessibility_website, food_allergy, allergies, deaf, auditive, mental, motor, blind, visual, autism, imagesurl, imagesurlmain, product_owner_company_identification FROM od_activity_accessibility
`,
    mapper: noopMapper
  },
  {
    title: 'Activity translation',
    inputFile: '/input/activity_translation.json',
    outputFile: '/tmp/activity_translation.ttl',
    query: `
SELECT product_description, closing_period, next_year_closing_period, accessibility_description, experience, garden, restaurant, food_allergy_desc, allergies_desc, deaf_desc, auditive_desc, mental_desc, motor_desc, blind_desc, visual_desc, autism_desc, entrance, route_and_levels, common_toilet, extra_facilities, resting_points_desc, shop_desc, playground_desc, space_table_desc FROM od_activity_accessibility_translations
`,
    mapper: noopMapper
  },
  {
    title: 'Accommodation',
    inputFile: '/input/accommodation_accessibility.json',
    outputFile: '/tmp/accommodation_accessibility.ttl',
    query: `
SELECT business_product_id, source_id, discriminator, information_group, product_type, parent_product_ids, changed_time, deleted, name_or_number, street, house_number, box_number, city_name, postal_code, main_city_name, promotional_region, statistical_region, x, y, lat, long, phone1, flickr, facebook, email, instagram, fax, twitter, phone2, phone3, website, location_type, green_key_labeled, accessibility_label, camper_label, link_to_accessibility_website, extra_care, food_allergy, allergies, visually_impaired, hearing_impaired, motor_impaired, comfort_class, status, tva_acknowledgement, last_status_change_date, notification_date, acknowledgement_date, number_of_camper_stands, number_of_camping_spots, number_of_short_term_camping_spots, number_of_touristic_camping_spots, number_of_long_term_camping_spots, number_of_hikers_huts, number_of_residence_units, number_of_residence_units_for_rental, number_of_units, maximum_capacity, file_number, tva_type, tva_capacity, tva_acknowledgement_date, tva_principal_acknowledgement_date, tva_revoke_date, tva_suspension_date, tva_suspension_removal_date, imagesurl, imagesurlmain, product_owner_company_identification, sub_type FROM od_accommodation_accessibility
`,
    mapper: noopMapper
  },
  {
    title: 'Accommodation translation',
    inputFile: '/input/accommodation_translation.json',
    outputFile: '/tmp/accommodation_translation.ttl',
    query: `
SELECT product_description, closing_period, next_year_closing_period, accessibility_description, experience, garden, restaurant, food_allergy_desc, allergies_desc, deaf_desc, auditive_desc, mental_desc, motor_desc, blind_desc, visual_desc, autism_desc, entrance, route_and_levels, common_toilet, extra_facilities, resting_points_desc, shop_desc, playground_desc, space_table_desc FROM od_activity_accessibility_translations
`,
    mapper: noopMapper
  },
  {
    title: 'POI',
    inputFile: '/input/poi_accessibility.json',
    outputFile: '/tmp/poi_accessibility.ttl',
    query: `
SELECT business_product_id, source_id, discriminator, information_group, changed_time, deleted, name, street, house_number, box_number, city_name, main_city_name, postal_code, promotional_region, statistical_region, x, y, lat, long, phone1, flickr, facebook, email, instagram, fax, twitter, phone2, phone3, website, sub_type, green_key_labeled, accessibility_label, link_to_accessibility_website, food_allergy, allergies, deaf, auditive, mental, motor, blind, visual, autism, imagesurl, imagesurlmain, product_owner_company_identification FROM od_poi_accessibility
`,
    mapper: noopMapper
  },
  {
    title: 'POI translation',
    inputFile: '/input/poi_translation.json',
    outputFile: '/tmp/poi_translation.ttl',
    query: `
SELECT product_description, closing_period, next_year_closing_period, accessibility_description, food_allergy_desc, allergies_desc, deaf_desc, auditive_desc, mental_desc, motor_desc, blind_desc, visual_desc, autism_desc, entrance, route_and_levels, common_toilet, extra_facilities, exhibition_space_desc, experience_desc, garden_desc FROM od_poi_accessibility_translations
`,
    mapper: noopMapper
  },
  {
    title: 'Service',
    inputFile: '/input/service_accessibility.json',
    outputFile: '/tmp/service_accessibility.ttl',
    query: `
SELECT business_product_id, source_id, discriminator, information_group, changed_time, deleted, street, house_number, box_number, city_name, postal_code, main_city_name, promotional_region, statistical_region, x, y, lat, long, phone1, flickr, facebook, email, instagram, fax, twitter, phone2, phone3, website, location_type, sub_type, green_key_labeled, accessibility_label, camper_label, link_to_accessibility_website, food_allergy, allergies, deaf, auditive, mental, motor, blind, visual, autism, imagesurl, imagesurlmain, product_owner_company_identification FROM od_service_accessibility
`,
    mapper: noopMapper
  },
  {
    title: 'Service translation',
    inputFile: '/input/service_translation.json',
    outputFile: '/tmp/service_translation.ttl',
    query: `
SELECT product_description, closing_period, next_year_closing_period, accessibility_description, food_allergy_desc, allergies_desc, deaf_desc, auditive_desc, mental_desc, motor_desc, blind_desc, visual_desc, autism_desc, entrance, route_and_levels, common_toilet, extra_facilities, restaurant_or_breakfast_area, exhibition_space, experience, offer, accessibility_prive_parking_desc, reservation FROM od_service_accessibility_translations
`,
    mapper: noopMapper
  },
  {
    title: 'Base registry',
    inputFile: '/input/base_registry.json',
    outputFile: '/tmp/base_registry.ttl',
    query: `
SELECT business_product_id,
parent_product_ids,
name, name_or_number,
discriminator, product_type,
street, house_number, box_number, postal_code, main_city_name,
x, y, lat, long,
promotional_region,
phone1, phone2, phone3,
email, website,
status,
comfort_class,
last_status_change_date,
notification_date,
acknowledgement_date,
tva_type,
tva_acknowledgement,
tva_acknowledgement_date,
tva_capacity,
tva_acknowledgement_date,
tva_revoke_date,
tva_suspension_date,
tva_suspension_removal_date,
number_of_units,
maximum_capacity,
number_of_short_term_camping_spots,
number_of_touristic_camping_spots,
number_of_camper_stands,
number_of_camping_spots,
number_of_residence_units,
number_of_long_term_camping_spots,
number_of_residence_units_for_rental,
number_of_hikers_huts,
green_key_labeled,
accessibility_label,
deleted,
changed_time
FROM od_accommodation_base_registry
WHERE (status in ('LICENSED', 'ACKNOWLEDGED', 'NOTIFIED') OR TVA_acknowledgement in ('A','B','C'))
AND (street IS NOT NULL AND postal_code IS NOT NULL)
AND deleted = 0
ORDER BY name
`,
    mapper: mapBaseRegistry
  },
  {
    title: 'Promotional info NL',
    inputFile: '/input/promotional_info_nl.json',
    outputFile: '/tmp/promotional_info_nl.ttl',
    query: descriptionQuery('nl'),
    mapper: mapPromotionalInfo
  },
  {
    title: 'Promotional info EN',
    inputFile: '/input/promotional_info_en.json',
    outputFile: '/tmp/promotional_info_en.ttl',
    query: descriptionQuery('en'),
    mapper: mapPromotionalInfo
  },
  {
    title: 'Promotional images',
    inputFile: '/input/promotional_images.json',
    outputFile: '/tmp/promotional_images.ttl',
    query: `
SELECT business_product_id, imagesurl
FROM od_accommodation_touristic as p
WHERE p.business_product_id IN (
  SELECT business_product_id
  FROM od_accommodation_base_registry
  WHERE (status in ('LICENSED', 'ACKNOWLEDGED', 'NOTIFIED') OR TVA_acknowledgement in ('A','B','C'))
  AND (street IS NOT NULL AND postal_code IS NOT NULL)
  AND deleted = 0
)
AND p.imagesurl IS NOT NULL
ORDER BY p.business_product_id`,
    mapper: mapPromotionalInfo
  }
];
