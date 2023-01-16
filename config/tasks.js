import { mapBaseRegistry, mapPromotionalInfo } from '../lib/logies-mapper';

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
