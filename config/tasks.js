import mapTouristAttractions from '../mappers/tourist-attraction';
import mapLodgings from '../mappers/lodging';

export default [
  {
    enabled: true,
    title: 'accommodation_base_registry',
    query: `
SELECT business_product_id, legacy_tdb_subcategory_id, legacy_vlis_id, name, name_or_number, discriminator, product_type, parent_product_ids, street, house_number, box_number, city_name, main_city_name, province, promotional_region, statistical_region, x, y, lat, long, postal_code, phone1, phone2, phone3, email, website, last_status_change_date, notification_date, acknowledgement_date, status, tva_acknowledgement, comfort_class, number_of_units, maximum_capacity, tent_capacity, normal_capacity, number_of_short_term_camping_spots, number_of_touristic_camping_spots, number_of_camper_stands, number_of_camping_spots, number_of_residence_units, number_of_long_term_camping_spots, number_of_residence_units_for_rental, number_of_hikers_huts, partnerlabel_fod, fire_safety_certificate_expiration_date, fire_safety_advice, file_number, iconic_cycling_routes, tva_type, tva_capacity, tva_capacity_old, tva_capacity_description, tva_acknowledgement_old, tva_acknowledgement_date, tva_principal_acknowledgement_date, tva_revoke_date, tva_suspension_date, tva_suspension_removal_date, product_owner_contact_id, product_owner_share_with_partners, product_owner_company_identification, product_owner_company_name, product_owner_title, product_owner_first_name, product_owner_last_name, product_owner_street, product_owner_house_number, product_owner_box_number, product_owner_city_name, product_owner_postal_code, product_owner_phone1, product_owner_phone2, product_owner_phone3, product_owner_email, product_owner_website, agent_contact_id, agent_share_with_partners, agent_company_identification, agent_company_name, agent_title, agent_first_name, agent_last_name, agent_street, agent_house_number, agent_box_number, agent_city_name, agent_postal_code, agent_phone1, agent_phone2, agent_phone3, agent_email, agent_website, product_owner_contact_id_fod, product_owner_company_identification_fod, product_owner_company_name_fod, product_owner_street_fod, product_owner_house_number_fod, product_owner_box_number_fod, product_owner_city_name_fod, product_owner_postal_code_fod, product_owner_phone1_fod, product_owner_phone2_fod, product_owner_phone3_fod, product_owner_email_fod, product_owner_website_fod, agent_contact_id_fod, agent_company_identification_fod, agent_company_name_fod, agent_street_fod, agent_house_number_fod, agent_box_number_fod, agent_city_name_fod, agent_postal_code_fod, agent_phone1_fod, agent_phone2_fod, agent_phone3_fod, agent_email_fod, agent_website_fod, tva_contact_contact_id, tva_contact_title, tva_contact_first_name, tva_contact_last_name, tva_contact_street, tva_contact_house_number, tva_contact_box_number, tva_contact_city_name, tva_contact_postal_code, tva_contact_phone1, tva_contact_phone2, tva_contact_phone3, tva_contact_email, tva_contact_website, tva_organization_contact_id, tva_organization_company_identification, tva_organization_company_name, tva_organization_street, tva_organization_house_number, tva_organization_box_number, tva_organization_city_name, tva_organization_postal_code, tva_organization_phone1, tva_organization_phone2, tva_organization_phone3, tva_organization_email, tva_organization_website, deleted, green_key_labeled, accessibility_label, changed_time
FROM od_accommodation_base_registry
ORDER BY business_product_id
`,
    mapper: mapLodgings
  },
  {
    enabled: true,
    title: 'accommodation_accessibility',
    query: `
SELECT business_product_id, source_id, discriminator, information_group, product_type, parent_product_ids, changed_time, deleted, name_or_number, street, house_number, box_number, city_name, postal_code, main_city_name, province, promotional_region, statistical_region, x, y, lat, long, phone1, flickr, facebook, email, instagram, fax, twitter, phone2, phone3, website, location_type, green_key_labeled, accessibility_label, camper_label, link_to_accessibility_website, extra_care, food_allergy, allergies, visually_impaired, hearing_impaired, motor_impaired, comfort_class, status, tva_acknowledgement, last_status_change_date, notification_date, acknowledgement_date, number_of_camper_stands, number_of_camping_spots, number_of_short_term_camping_spots, number_of_touristic_camping_spots, number_of_long_term_camping_spots, number_of_hikers_huts, number_of_residence_units, number_of_residence_units_for_rental, number_of_units, maximum_capacity, file_number, tva_type, tva_capacity, tva_acknowledgement_date, tva_principal_acknowledgement_date, tva_revoke_date, tva_suspension_date, tva_suspension_removal_date, imagesurl, imagesurlmain, product_owner_company_identification, sub_type
FROM od_accommodation_accessibility
ORDER BY business_product_id
`,
    translations: {
      query: function(lang) {
        return `
SELECT product_id as business_product_id, product_description, closing_period, next_year_closing_period, description, entrance, route_and_levels, common_toilet, extra_facilities, appartement, bed_and_bathroom, restaurant_or_breakfast_area, bedroom, dining_room, exhibition_space, experience, living_space, pitch, accessibility_private_parking, sanitary_block, extra_care_description, allergies_description
FROM od_accommodation_accessibility_translations('${lang}', '${lang}') as p
ORDER BY p.product_id
`;
      },
      languages: ['nl', 'en']
    },
    mapper: mapLodgings
  },
  {
    enabled: true,
    title: 'activity_accessibility',
    query: `
SELECT business_product_id, source_id, discriminator, information_group, changed_time, deleted, name, street, house_number, box_number, city_name, main_city_name, province, postal_code, promotional_region, statistical_region, x, y, lat, long, phone1, flickr, facebook, email, instagram, fax, twitter, phone2, phone3, website, sub_type, green_key_labeled, accessibility_label, link_to_accessibility_website, food_allergy, allergies, deaf, auditive, mental, motor, blind, visual, autism, imagesurl, imagesurlmain, product_owner_company_identification
FROM od_activity_accessibility
ORDER BY business_product_id
`,
    translations: {
      query: function(lang) {
        return `
SELECT product_id as business_product_id, product_description, closing_period, next_year_closing_period, accessibility_description, experience, garden, restaurant, food_allergy_desc, allergies_desc, deaf_desc, auditive_desc, mental_desc, motor_desc, blind_desc, visual_desc, autism_desc, entrance, route_and_levels, common_toilet, extra_facilities, resting_points_desc, shop_desc, playground_desc, space_table_desc
FROM od_activity_accessibility_translations('${lang}', '${lang}') as p
ORDER BY p.product_id
  `;
      },
      languages: ['nl', 'en']
    },
    mapper: mapTouristAttractions
  },
  {
    enabled: true,
    title: 'poi_accessibility',
    query: `
SELECT business_product_id, source_id, discriminator, information_group, changed_time, deleted, name, street, house_number, box_number, city_name, main_city_name, province, postal_code, promotional_region, statistical_region, x, y, lat, long, phone1, flickr, facebook, email, instagram, fax, twitter, phone2, phone3, website, sub_type, green_key_labeled, accessibility_label, link_to_accessibility_website, food_allergy, allergies, deaf, auditive, mental, motor, blind, visual, autism, imagesurl, imagesurlmain, product_owner_company_identification
FROM od_poi_accessibility
ORDER BY business_product_id
`,
    translations: {
      query: function(lang) {
  return `
SELECT product_id as business_product_id, product_description, closing_period, next_year_closing_period, accessibility_description, food_allergy_desc, allergies_desc, deaf_desc, auditive_desc, mental_desc, motor_desc, blind_desc, visual_desc, autism_desc, entrance, route_and_levels, common_toilet, extra_facilities, exhibition_space_desc, experience_desc, garden_desc
FROM od_poi_accessibility_translations('${lang}', '${lang}') as p
ORDER BY p.product_id
`;
},
      languages: ['nl', 'en']
    },
    mapper: mapTouristAttractions
  },
  {
    enabled: true,
    title: 'service_accessibility',
    query: `
SELECT business_product_id, source_id, discriminator, information_group, changed_time, deleted, street, house_number, box_number, city_name, postal_code, main_city_name, province, promotional_region, statistical_region, x, y, lat, long, phone1, flickr, facebook, email, instagram, fax, twitter, phone2, phone3, website, location_type, sub_type, green_key_labeled, accessibility_label, camper_label, link_to_accessibility_website, food_allergy, allergies, deaf, auditive, mental, motor, blind, visual, autism, imagesurl, imagesurlmain, product_owner_company_identification
FROM od_service_accessibility
ORDER BY business_product_id
`,
    translations: {
      query: function(lang) {
        return `
SELECT product_id as business_product_id, product_description, closing_period, next_year_closing_period, accessibility_description, food_allergy_desc, allergies_desc, deaf_desc, auditive_desc, mental_desc, motor_desc, blind_desc, visual_desc, autism_desc, entrance, route_and_levels, common_toilet, extra_facilities, restaurant_or_breakfast_area, exhibition_space, experience, offer, accessibility_prive_parking_desc, reservation
FROM od_service_accessibility_translations('${lang}', '${lang}') as p
ORDER BY p.product_id
`;
      },
      languages: ['nl', 'en']
    },
    mapper: mapTouristAttractions
  }
];
