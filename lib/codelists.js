const tvlOrganizationUri = 'http://data.vlaanderen.be/id/organisatie/OVO000034';

const registrationStatusMap = {
  ACKNOWLEDGED: 'http://linked.toerismevlaanderen.be/id/concepts/bb9d1b1b-05ea-4a98-bb54-87084c38da4e',
  LICENSED: 'http://linked.toerismevlaanderen.be/id/concepts/96dbd436-b59b-4e6e-b080-26a83456dc4e',
  NOTIFIED: 'http://linked.toerismevlaanderen.be/id/concepts/ed624155-305e-4da3-83a0-e4c586ca7b81'
};

const registrationTypeMap = {
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
  CAMPING_ACCOMMODATION_PARK: 'http://linked.toerismevlaanderen.be/id/concepts/3bdca45e-acdf-45c2-856d-640e62c40bb3'
};

const touristicRegionMap = {
  antwerpseKempen: 'http://linked.toerismevlaanderen.be/id/concepts/01a3aeb9-308b-43cc-a20c-00d4bdff3945',
  brugseOmmeland: 'http://linked.toerismevlaanderen.be/id/concepts/1ea20947-f120-4d2f-b9ec-c5cb8844c510',
  groeneGordel: 'http://linked.toerismevlaanderen.be/id/concepts/434521ce-28ef-4fc6-9c5f-db8f75f27213',
  hageland: 'http://linked.toerismevlaanderen.be/id/concepts/dc441833-7d38-4f03-9e6a-846854dd1eb8',
  haspengouw: 'http://linked.toerismevlaanderen.be/id/concepts/93211a0f-9e45-44f1-97cb-7d81b6c6861d',
  kunststadAntwerpen: null,
  kunststadBrugge: null,
  kunststadGent: null,
  kunststadLeuven: null,
  kunststadMechelen: null,
  kust: 'http://linked.toerismevlaanderen.be/id/concepts/4fac735f-0c74-43b9-bde1-1bc5fe809ccc',
  leieStreek: 'http://linked.toerismevlaanderen.be/id/concepts/16bacff2-3d77-4205-9196-372c4841c854',
  limburgseKempen: 'http://linked.toerismevlaanderen.be/id/concepts/a8aa05ec-4f72-442b-a12f-a6d1554f2270',
  maasland: 'http://linked.toerismevlaanderen.be/id/concepts/4bfdc566-c9ea-4721-9445-ecad54c39813',
  meetjesland: 'http://linked.toerismevlaanderen.be/id/concepts/622517b3-a421-46c5-b5a9-8884a89e2775',
  scheldeland: 'http://linked.toerismevlaanderen.be/id/concepts/611fcac6-410b-468d-9d09-b03bdd4059c8',
  vlaamseArdennen: 'http://linked.toerismevlaanderen.be/id/concepts/f3389ab4-5f24-4d83-8bd0-4eb8e7867718',
  voerstreek: 'http://linked.toerismevlaanderen.be/id/concepts/423cef99-a60d-4a3f-b1b8-78f12472624b',
  waasland: 'http://linked.toerismevlaanderen.be/id/concepts/5d49dc34-133c-477e-8581-9b1071a87ce3',
  westhoek: 'http://linked.toerismevlaanderen.be/id/concepts/172629db-dd70-45ec-b56b-6ea4f0b07d05'
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
  }
};

export {
  tvlOrganizationUri,
  registrationStatusMap,
  registrationTypeMap,
  touristicRegionMap,
  nonStandardizedUnitMap,
  comfortClasses
}