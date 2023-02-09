const tvlOrganizationUri = 'http://data.vlaanderen.be/id/organisatie/OVO000034';
const goodplanetOrganizationUri = 'http://linked.toerismevlaanderen.be/id/registered-organizations/49f88928-bf0e-402e-a2a7-bbc06fbb0eed';

const registrationStatusMap = {
  // Logiesdecreet
  ACKNOWLEDGED: 'http://linked.toerismevlaanderen.be/id/concepts/bb9d1b1b-05ea-4a98-bb54-87084c38da4e',
  LICENSED: 'http://linked.toerismevlaanderen.be/id/concepts/96dbd436-b59b-4e6e-b080-26a83456dc4e',
  NOTIFIED: 'http://linked.toerismevlaanderen.be/id/concepts/ed624155-305e-4da3-83a0-e4c586ca7b81',
  STOPPED: 'http://linked.toerismevlaanderen.be/id/concepts/1ab08286-bc53-4a09-958d-e29b4acd76bf',
  LICENSE_REVOKED: 'http://linked.toerismevlaanderen.be/id/concepts/0f79a629-494f-4332-b071-5ef8061eb50e',
  // Other values:
  // - ACKNOWLEDGED_BY_PRINCIPLE
  // - AMBTSHALVE_LICENSED
  // - LICENCE_APPLICATION_REJECTED
  // - LICENSED_BY_COCOF
  // - LICENSE_APPLICATION_COMPLETE
  // - LICENSE_APPLICATION_IN_PROGRESS
  // - NEVER_NOTIFIED_NOR_APPLIED_FOR_LICENSE
  // - NOTIFICATION_APPLICATION_IN_PROGRESS
  // - NOT_ACKNOWLEDGED

  // TVA decreet
  A: 'http://linked.toerismevlaanderen.be/id/concepts/37fd4d81-846b-448d-92d1-4dc1232540fd',
  B: 'http://linked.toerismevlaanderen.be/id/concepts/37fd4d81-846b-448d-92d1-4dc1232540fd',
  C: 'http://linked.toerismevlaanderen.be/id/concepts/37fd4d81-846b-448d-92d1-4dc1232540fd',
  TVA: 'http://linked.toerismevlaanderen.be/id/concepts/37fd4d81-846b-448d-92d1-4dc1232540fd',
  HOSTEL: 'http://linked.toerismevlaanderen.be/id/concepts/37fd4d81-846b-448d-92d1-4dc1232540fd',
  REVOKED: 'http://linked.toerismevlaanderen.be/id/concepts/5a164cce-0c3c-469d-8910-707a456e0933',
  SUSPENDED: 'http://linked.toerismevlaanderen.be/id/concepts/4f269330-bc00-41e9-8928-1a454f38e760'
  // Other values:
  // - ACKNOWLEDGED_BY_PRINCIPLE
  // - NOT_ACKNOWLEDGED
};

const registrationCategoryMap = {
  // Logiesdecreet
  GUEST_ROOM: 'http://linked.toerismevlaanderen.be/id/concepts/da056648-dfc2-4c81-ae2a-bb07a7824c9a',
  BED_AND_BREAKFAST: 'http://linked.toerismevlaanderen.be/id/concepts/488818e6-e991-49b8-a615-d849f5ad5f6e',
  CAMPER_TERRAIN: 'http://linked.toerismevlaanderen.be/id/concepts/7c33a867-1ce5-4111-9f64-6edb6a7d7be8',
  CAMPER_AREA: 'http://linked.toerismevlaanderen.be/id/concepts/8c642d06-b80b-450b-9f82-72943336e811',
  CAMPING: 'http://linked.toerismevlaanderen.be/id/concepts/85c0404d-976c-4db1-a2ec-91ff38a39e75',
  HOSTEL: 'http://linked.toerismevlaanderen.be/id/concepts/44f80e97-69ef-4777-a12c-19b5f4967eb9',
  HOTEL: 'http://linked.toerismevlaanderen.be/id/concepts/784126a4-c4a7-415a-a1fe-15b7a98abb92',
  HOLIDAY_PARK: 'http://linked.toerismevlaanderen.be/id/concepts/fc5b3bc8-47d3-4525-9c8a-eb587ecbe622',
  HOLIDAY_COTTAGE: 'http://linked.toerismevlaanderen.be/id/concepts/5fb32d65-39a2-4795-89e5-b96b4f877218',
  YOUTH_ACCOMMODATION: 'http://linked.toerismevlaanderen.be/id/concepts/861b2cf2-81d9-4134-a15a-31f97487797b',
  GENERIC_ROOMS: 'http://linked.toerismevlaanderen.be/id/concepts/b8d09818-dfc9-49b3-aaa6-a21f7a40867e',
  HOLIDAY_ACCOMMODATION: 'http://linked.toerismevlaanderen.be/id/concepts/efac0ef3-a803-4874-8b8a-8c50d405ce79',
  HOLIDAY_CENTRE: 'http://linked.toerismevlaanderen.be/id/concepts/b02b59e8-580f-4d97-a88b-8d2ce59ad3c9',
  GENERIC_TERRAIN: 'http://linked.toerismevlaanderen.be/id/concepts/108e02aa-5b61-4305-aef8-8547bd80f9c4',
  CAMPING_ACCOMMODATION_PARK: 'http://linked.toerismevlaanderen.be/id/concepts/3bdca45e-acdf-45c2-856d-640e62c40bb3',
  // TVA decreet
  A: 'http://linked.toerismevlaanderen.be/id/concepts/d3194d20-f292-46a0-9762-f4dd206172a5',
  B: 'http://linked.toerismevlaanderen.be/id/concepts/d3194d20-f292-46a0-9762-f4dd206172a5',
  C: 'http://linked.toerismevlaanderen.be/id/concepts/d3194d20-f292-46a0-9762-f4dd206172a5',
  TVA: 'http://linked.toerismevlaanderen.be/id/concepts/a56ea80b-1aac-470c-8a99-a64551c5cf7a',
  HOSTEL: 'http://linked.toerismevlaanderen.be/id/concepts/e38a3bc6-609d-4fa0-a824-46fa2cb4dda1',
  YOUTH: 'http://linked.toerismevlaanderen.be/id/concepts/d3194d20-f292-46a0-9762-f4dd206172a5',
  ADULT: 'http://linked.toerismevlaanderen.be/id/concepts/a56ea80b-1aac-470c-8a99-a64551c5cf7a'
};

const registrationTypeMap = {
  GUEST_ROOM: 'http://linked.toerismevlaanderen.be/id/concepts/842d68ad-5dec-45d3-8b97-c3002fedf958',
  BED_AND_BREAKFAST: 'http://linked.toerismevlaanderen.be/id/concepts/842d68ad-5dec-45d3-8b97-c3002fedf958',
  CAMPER_TERRAIN: 'http://linked.toerismevlaanderen.be/id/concepts/f79f1c45-9b70-4a78-b0ef-df67bd440692',
  CAMPER_AREA: 'http://linked.toerismevlaanderen.be/id/concepts/f79f1c45-9b70-4a78-b0ef-df67bd440692',
  CAMPING: 'http://linked.toerismevlaanderen.be/id/concepts/d2d28d1d-bd4e-4aac-86ae-6a70861a7a73',
  HOSTEL: 'http://linked.toerismevlaanderen.be/id/concepts/29f9d6d0-d945-4819-bbc6-5c2caf46eb73',
  HOTEL: 'http://linked.toerismevlaanderen.be/id/concepts/149c732c-1369-4448-b0ea-d7a26ee8757f',
  HOLIDAY_PARK: 'http://linked.toerismevlaanderen.be/id/concepts/1e01d995-7d1f-40e2-8a90-32c7795e09ee',
  HOLIDAY_COTTAGE: 'http://linked.toerismevlaanderen.be/id/concepts/5b37541f-fd32-4ef8-8ca9-5881f30dd4d7',
  YOUTH_ACCOMMODATION: 'http://linked.toerismevlaanderen.be/id/concepts/3fc52ed7-75b5-4690-a8ba-115662d1f1aa',
  GENERIC_ROOMS: 'http://linked.toerismevlaanderen.be/id/concepts/332fe286-4a94-47b6-a946-84f5035004d0',
  HOLIDAY_ACCOMMODATION: 'http://linked.toerismevlaanderen.be/id/concepts/332fe286-4a94-47b6-a946-84f5035004d0',
  HOLIDAY_CENTRE: 'http://linked.toerismevlaanderen.be/id/concepts/332fe286-4a94-47b6-a946-84f5035004d0',
  GENERIC_TERRAIN: 'http://linked.toerismevlaanderen.be/id/concepts/9882a4ac-7bd2-46d1-9eee-8311125ad6be',
  CAMPING_ACCOMMODATION_PARK: 'http://linked.toerismevlaanderen.be/id/concepts/9882a4ac-7bd2-46d1-9eee-8311125ad6be'
};

const touristicRegionMap = {
  antwerpseKempen: 'http://linked.toerismevlaanderen.be/id/touristic-regions/01a3aeb9-308b-43cc-a20c-00d4bdff3945',
  brugseOmmeland: 'http://linked.toerismevlaanderen.be/id/touristic-regions/1ea20947-f120-4d2f-b9ec-c5cb8844c510',
  groeneGordel: 'http://linked.toerismevlaanderen.be/id/touristic-regions/434521ce-28ef-4fc6-9c5f-db8f75f27213',
  hageland: 'http://linked.toerismevlaanderen.be/id/touristic-regions/dc441833-7d38-4f03-9e6a-846854dd1eb8',
  haspengouw: 'http://linked.toerismevlaanderen.be/id/touristic-regions/93211a0f-9e45-44f1-97cb-7d81b6c6861d',
  hasselt: 'http://linked.toerismevlaanderen.be/id/touristic-regions/00ee4d42-5188-4ec2-bf9d-45e92e68efdc',
  kunststadAntwerpen: 'http://linked.toerismevlaanderen.be/id/touristic-regions/d2d03bf9-3ea8-4750-a7b6-b91680bcc90c',
  kunststadBrugge: 'http://linked.toerismevlaanderen.be/id/touristic-regions/35605b6f-0b57-45ae-a6bc-1a4626375563',
  kunststadBrussel: 'http://linked.toerismevlaanderen.be/id/touristic-regions/df8fcb3f-0979-4bc0-b24b-03c85de4dd61',
  kunststadGent: 'http://linked.toerismevlaanderen.be/id/touristic-regions/ed7b5c5c-4235-4967-b9aa-0cd4b03f558f',
  kunststadLeuven: 'http://linked.toerismevlaanderen.be/id/touristic-regions/de53b1db-64be-4fdb-a0eb-3920ab19add9',
  kunststadMechelen: 'http://linked.toerismevlaanderen.be/id/touristic-regions/104d8914-3f24-4154-bb01-5ecba6081832',
  kust: 'http://linked.toerismevlaanderen.be/id/touristic-regions/4fac735f-0c74-43b9-bde1-1bc5fe809ccc',
  leieStreek: 'http://linked.toerismevlaanderen.be/id/touristic-regions/16bacff2-3d77-4205-9196-372c4841c854',
  limburgseKempen: 'http://linked.toerismevlaanderen.be/id/touristic-regions/a8aa05ec-4f72-442b-a12f-a6d1554f2270',
  maasland: 'http://linked.toerismevlaanderen.be/id/touristic-regions/4bfdc566-c9ea-4721-9445-ecad54c39813',
  meetjesland: 'http://linked.toerismevlaanderen.be/id/touristic-regions/622517b3-a421-46c5-b5a9-8884a89e2775',
  randAntwerpenMechelen: 'http://linked.toerismevlaanderen.be/id/touristic-regions/8eb895b2-4ca3-4099-b257-466b8bbd84c8',
  scheldeland: 'http://linked.toerismevlaanderen.be/id/touristic-regions/611fcac6-410b-468d-9d09-b03bdd4059c8',
  vlaamseArdennen: 'http://linked.toerismevlaanderen.be/id/touristic-regions/f3389ab4-5f24-4d83-8bd0-4eb8e7867718',
  voerstreek: 'http://linked.toerismevlaanderen.be/id/touristic-regions/423cef99-a60d-4a3f-b1b8-78f12472624b',
  waasland: 'http://linked.toerismevlaanderen.be/id/touristic-regions/5d49dc34-133c-477e-8581-9b1071a87ce3',
  westhoek: 'http://linked.toerismevlaanderen.be/id/touristic-regions/172629db-dd70-45ec-b56b-6ea4f0b07d05'
};

const informationGroupsMap = {
  ACTIVITY: 'http://w3id.org/ost/ns#Recreation',
  ACCOMMODATION: 'http://schema.org/Accommodation',
  SERVICE: 'http://schema.org/Service',
  POINT_OF_INTEREST: 'http://schema.org/Place',
  ROUTE: 'http://w3id.org/ost/ns#Route',
};

const productTypesMap = {

};

const productCategoriesMap = {

};

const locationTypesMap = {

};

// Unofficial codelists

const nonStandardizedUnitMap = {
  number_of_short_term_camping_spots: 'aantal campingplaatsen voor kortverblijf',
  number_of_touristic_camping_spots: 'aantal toeristische campingplaatsen',
  number_of_camper_stands: 'aantal staanplaatsen',
  number_of_camping_spots: 'aantal campingplaatsen',
  number_of_residence_units: 'aantal wooneenheden',
  number_of_long_term_camping_spots: 'aantal campingplaatsen voor lange termijn',
  number_of_residence_units_for_rental: 'aantal wooneenheden te huur',
  number_of_hikers_huts: 'aantal wandelaarshutten'
};

const comfortRatingBasicLuxe = {
  worstRating: 'BASIC',
  bestRating: 'LUXURY'
};

const comfortRatingStars = {
  worstRating: 'ONE_STAR',
  bestRating: 'FIVE_STARS_SUPERIOR'
};

const comfortRatingYouthAccomodations = {
  worstRating: 'A',
  bestRating: 'C'
};

const comfortClasses = {
  BASIC: {
    label: 'Basic',
    scale: comfortRatingBasicLuxe
  },
  COMFORT: {
    label: 'Comfort',
    scale: comfortRatingBasicLuxe
  },
  LUXURY: {
    label: 'Luxe',
    scale: comfortRatingBasicLuxe
  },
  ONE_STAR: {
    label: '1 *',
    scale: comfortRatingStars
  },
  ONE_STAR_SUPERIOR: {
    label: '1 * sup',
    scale: comfortRatingStars
  },
  TWO_STARS: {
    label: '2 *',
    scale: comfortRatingStars
  },
  TWO_STARS_SUPERIOR: {
    label: '2 * sup',
    scale: comfortRatingStars
  },
  THREE_STARS: {
    label: '3 *',
    scale: comfortRatingStars
  },
  THREE_STARS_SUPERIOR: {
    label: '3 * sup',
    scale: comfortRatingStars
  },
  FOUR_STARS: {
    label: '4 *',
    scale: comfortRatingStars
  },
  FOUR_STARS_SUPERIOR: {
    label: '4 * sup',
    scale: comfortRatingStars
  },
  FIVE_STARS: {
    label: '5 *',
    scale: comfortRatingStars
  },
  FIVE_STARS_SUPERIOR: {
    label: '5 * sup',
    scale: comfortRatingStars
  },
  A: {
    label: 'A',
    scale: comfortRatingYouthAccomodations
  },
  B: {
    label: 'B',
    scale: comfortRatingYouthAccomodations
  },
  C: {
    label: 'C',
    scale: comfortRatingYouthAccomodations
  },
  // TVA decree status without rating
  NOT_ACKNOWLEDGED: null,
  HOSTEL: null,
  TVA: null,
  REVOKED: null,
  ACKNOWLEDGED_BY_PRINCIPLE: null,
  SUSPENDED: null
};

const accessibilityLabels = {
  BASIC: 'Toegankelijkheidslabel A',
  COMFORT: 'Toegankelijkheidslabel A+',
  INFORMATION_AVAILABLE: null
};

const honorificPrefixes = {
  MR: 'Meneer',
  MS: 'Mejuffer',
  MRS: 'Mevrouw',
  MRS_AND_MRS: 'Dames',
  MR_AND_MR: 'Heren',
  MR_AND_MRS: 'Mevrouw en meneer',
};

export {
  tvlOrganizationUri,
  goodplanetOrganizationUri,
  registrationStatusMap,
  registrationTypeMap,
  registrationCategoryMap,
  touristicRegionMap,
  informationGroupsMap,
  productTypesMap,
  productCategoriesMap,
  locationTypesMap,
  nonStandardizedUnitMap,
  comfortClasses,
  accessibilityLabels,
  honorificPrefixes
}
