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

const locationTypesMap = {
  RURAL : 'http://linked.toerismevlaanderen.be/id/concepts/98f4dcef-a4de-4573-a306-b5f1e9f65530',
  ACTIVE_FARM : 'http://linked.toerismevlaanderen.be/id/concepts/ff15b994-03a9-45cd-b066-dc2f42cdd5ac',
  URBAN : 'http://linked.toerismevlaanderen.be/id/concepts/03e58bde-7d4c-4874-8d45-60e847780e88',
  INDOOR : 'http://linked.toerismevlaanderen.be/id/concepts/f440b724-0c51-4fe7-9a5d-36f5083bbe22',
  UNKNOWN: null
};

const productCategoriesMap = {
  ACCESSIBILITY_EQUIPMENT_RENTING : 'http://linked.toerismevlaanderen.be/id/concepts/6149af7f-5e99-4c80-aad4-b91a8d4c1b4e',
  ANIMAL_PARK : 'http://linked.toerismevlaanderen.be/id/concepts/624f9f42-5ecf-43f8-9510-f8b49bea582c',
  ARCHEOLOGY : 'http://linked.toerismevlaanderen.be/id/concepts/8e9c62da-6ee8-45b9-a3f1-47e1c2418fb9',
  ARCHITECTURE : 'http://linked.toerismevlaanderen.be/id/concepts/06942a47-488b-47aa-8021-8b44fe77d4ca',
  ARTISTIC_CRAFTS_AND_PROFESSIONS : 'http://linked.toerismevlaanderen.be/id/concepts/c7b4078a-3550-4052-a001-54e1d6734c86',
  ART_GALLERY : 'http://linked.toerismevlaanderen.be/id/concepts/94543ab3-eda6-48c2-b8ea-9146a164c2f8',
  BOOKS_AND_PRINTING : 'http://linked.toerismevlaanderen.be/id/concepts/9e70c687-b1f2-4884-aabf-26a9534a3e6f',
  BREWERY : 'http://linked.toerismevlaanderen.be/id/concepts/518ddd62-a0db-4bd0-889a-c43a26daf26f',
  BREWERY_VISIT : 'http://linked.toerismevlaanderen.be/id/concepts/a5170305-613a-4ed9-9276-3ab2bec6ab1d',
  CAFE : 'http://linked.toerismevlaanderen.be/id/concepts/2690d6d7-5294-4ce2-bed6-12169792eafd',
  CASTLE : 'http://linked.toerismevlaanderen.be/id/concepts/f66008a3-50b7-49f3-a7ca-0a30853f37b8',
  CHURCH : 'http://linked.toerismevlaanderen.be/id/concepts/96b6b692-be85-4f3d-92ed-af0160584f61',
  CONGRES_CENTRE : 'http://linked.toerismevlaanderen.be/id/concepts/008f3854-d289-4bea-855a-11e0e434a8f1',
  CRAFTS: 'http://linked.toerismevlaanderen.be/id/concepts/c7b4078a-3550-4052-a001-54e1d6734c86',
  CULINARY : 'http://linked.toerismevlaanderen.be/id/concepts/dae4c19a-72e4-4fb9-a1a6-863de38ce7b3',
  CULTURAL_CENTRE : 'http://linked.toerismevlaanderen.be/id/concepts/1d8a8905-1087-49ed-a3da-2bdc489d21a8',
  CYCLING_LOOP : 'http://linked.toerismevlaanderen.be/id/concepts/86bbb471-85fe-4fdf-af74-cd95a92d5410',
  EDUCATION : 'http://linked.toerismevlaanderen.be/id/concepts/1134bc9b-2342-49bc-b103-957b376c3a5d',
  EVENT_MUSEUM : 'http://linked.toerismevlaanderen.be/id/concepts/93a28eaa-aafc-40f5-9fae-bf8bce8bc7a1',
  EVENT_TOURISTIC : 'http://linked.toerismevlaanderen.be/id/concepts/bd9e6785-f373-4f20-a1cd-ba49fd501bb0',
  FAUNA_AND_FLORA : 'http://linked.toerismevlaanderen.be/id/concepts/0f2e5973-2da1-481f-acc0-938a9755fe0a',
  FLANDERS_INFORMATION_OFFICE : 'http://linked.toerismevlaanderen.be/id/concepts/8d8023ea-9d3b-4105-b0e5-7110341ffa85',
  HIKING_LOOP : 'http://linked.toerismevlaanderen.be/id/concepts/2bd44e2e-412d-455c-9cb5-47665358e0f9',
  HIKING_THEMATIC_ROUTE : 'http://linked.toerismevlaanderen.be/id/concepts/9817e3a4-5cf4-498f-be9e-d85709855fd4',
  HISTORICAL_BUILDING : 'http://linked.toerismevlaanderen.be/id/concepts/9ae00620-4058-422f-ba87-b37154b2ddd0',
  HISTORY : 'http://linked.toerismevlaanderen.be/id/concepts/9164777c-c4cd-4951-954e-837f8389fa61',
  INDOOR_PLAY_GROUND : 'http://linked.toerismevlaanderen.be/id/concepts/baef5c19-7e66-421f-8074-c75660ed555e',
  LOCAL_INFORMATION_OFFICE : 'http://linked.toerismevlaanderen.be/id/concepts/96bdff00-f6fc-4ae9-b7f5-734807795fc9',
  MEETING_LOCATION : 'http://linked.toerismevlaanderen.be/id/concepts/483b607c-dd7f-4d19-b09d-32ab1580a09e',
  MOTOR_LOOP : 'http://linked.toerismevlaanderen.be/id/concepts/4a00d174-ad77-4c8f-b414-4c40a84765fc',
  NATURAL_AREA : 'http://linked.toerismevlaanderen.be/id/concepts/17a0d89a-d81c-4908-8946-949238ef57a4',
  OFFICE_NOT_RECOGNIZED_BY_TVL : 'http://linked.toerismevlaanderen.be/id/concepts/43b53b87-aa11-4fd1-a19e-299dcc814eff',
  PAINTING_AND_DRAWING : 'http://linked.toerismevlaanderen.be/id/concepts/2bc28c19-4804-49bc-abec-96951426f035',
  PARK : 'http://linked.toerismevlaanderen.be/id/concepts/63f52e5a-297a-41c1-b2eb-c9c875dc435d',
  PLACE : 'http://linked.toerismevlaanderen.be/id/concepts/d4741fc6-872c-4792-8b9a-c6f81c75007a',
  PUBLIC_TOILET : 'http://linked.toerismevlaanderen.be/id/concepts/9fecdd75-3127-4bf4-a629-40f12def041e',
  RECREATION_DOMAIN : 'http://linked.toerismevlaanderen.be/id/concepts/fae63f3f-b718-4d3d-9366-eb0f76be9ca1',
  REGIONAL_INFORMATION_OFFICE : 'http://linked.toerismevlaanderen.be/id/concepts/a5c3819d-55a4-4b01-9ee1-db9d4b0c98e7',
  RELIGIOUS_ART_AND_PRACTICE : 'http://linked.toerismevlaanderen.be/id/concepts/692a5fd0-e474-47ce-a476-0c442e9dcb90',
  RESTAURANT : 'http://linked.toerismevlaanderen.be/id/concepts/f68312f7-09d3-4b03-a2b7-1b2dd1cb91d3',
  SCULPTURE : 'http://linked.toerismevlaanderen.be/id/concepts/8e7d6236-8d76-44eb-8574-c4fd8649a596',
  SPORTS : 'http://linked.toerismevlaanderen.be/id/concepts/4612795b-7cc6-4fc0-9374-52a273a95e19',
  SWIMMING_POOL : 'http://linked.toerismevlaanderen.be/id/concepts/d7a3721f-abd3-458e-9466-69a93a7ad52d',
  SWIMMING_POOL_PARADISE : 'http://linked.toerismevlaanderen.be/id/concepts/96b6b8d5-1646-4267-8f78-4934c5c9c0c1',
  TEA_ROOM : 'http://linked.toerismevlaanderen.be/id/concepts/54f0a669-e221-443a-9f56-afb67d4a9760',
  TOUR : 'http://linked.toerismevlaanderen.be/id/concepts/0b842ddd-af7a-4cd7-98d0-d29afd2a091e',
  TOURISTIC_REGION : 'http://linked.toerismevlaanderen.be/id/concepts/e8920ff9-92f3-4ef6-9aa9-155de1d310de',
  TRANSPORT : 'http://linked.toerismevlaanderen.be/id/concepts/384cab08-42fa-4d3b-9ac1-deb5c3e493ed',
  UTENSILS : 'http://linked.toerismevlaanderen.be/id/concepts/3159f994-8040-47af-959b-492bf1af94de',
  VISITOR_CENTRE : 'http://linked.toerismevlaanderen.be/id/concepts/468f040a-58fe-4ce2-8ff4-23b18a470cfb',
  WARFARE_AND_WEAPONRY : 'http://linked.toerismevlaanderen.be/id/concepts/fcdbd4df-4476-46e2-bd84-9b2d169b674f',
  WELLNESS_CENTRE : 'http://linked.toerismevlaanderen.be/id/concepts/63f04d5f-15ea-44f9-a873-55f604652bb7',
  WOOD : 'http://linked.toerismevlaanderen.be/id/concepts/e1efce9b-ab94-4f33-a51c-55799dd56b42'
};

const productTypesMap = {
  YOUTH_ACCOMMODATION : 'http://linked.toerismevlaanderen.be/id/concepts/01fc1581-6297-42b5-9f53-3c0934c8a412',
  ATTRACTION_OR_ANIMAL_PARK : 'http://linked.toerismevlaanderen.be/id/concepts/cb0b8e92-6f10-4954-bbab-863ce609d0e4',
  FOOD_DRINKS : 'http://linked.toerismevlaanderen.be/id/concepts/4f717240-71ac-4888-bd88-6acdf8b7614a',
  RENTING_SERVICE : 'http://linked.toerismevlaanderen.be/id/concepts/e84cd3eb-cdcb-4e0d-89fe-0a9b5aa9ee16',
  BUILDING : 'http://linked.toerismevlaanderen.be/id/concepts/b6ad1f2c-a98b-4a51-a276-926c229b1c81',
  NIGHT_LIFE : 'http://linked.toerismevlaanderen.be/id/concepts/6a6488d8-7918-4dc4-b04f-9305695b3237',
  LOOP : 'http://linked.toerismevlaanderen.be/id/concepts/0a5b71bb-fd76-4bde-9a70-a634dd6e5efd',
  MUSEUM : 'http://linked.toerismevlaanderen.be/id/concepts/93a6a6b7-a3a7-423f-b368-b59f52e618ae',
  PLAY : 'http://linked.toerismevlaanderen.be/id/concepts/681318e2-92d7-4ea4-87b1-0a8d2b38ee1b',
  NATURE : 'http://linked.toerismevlaanderen.be/id/concepts/ef7b4899-9f2a-4bec-a5de-a42a9d710e25',
  CEMETERY : 'http://linked.toerismevlaanderen.be/id/concepts/5373033e-2a63-4cae-8fc6-4418133c13b7',
  EXCURSION_OR_DAY_TRIP : 'http://linked.toerismevlaanderen.be/id/concepts/1e6e5f39-02e1-4653-8f6f-f24a644710bc',
  TOURIST_INFORMATION_CENTRE : 'http://linked.toerismevlaanderen.be/id/concepts/7be203f3-9af4-4116-a4a1-7e639d632b1e',
  MONUMENT : 'http://linked.toerismevlaanderen.be/id/concepts/77c0e5fe-d56a-4120-b3d0-2d466bff4890',
  CONGRESS_CENTRE : 'http://linked.toerismevlaanderen.be/id/concepts/008f3854-d289-4bea-855a-11e0e434a8f1',
  LOCATION_OR_REGION : 'http://linked.toerismevlaanderen.be/id/concepts/e8920ff9-92f3-4ef6-9aa9-155de1d310de',
  EVENT : 'http://linked.toerismevlaanderen.be/id/concepts/4d9c86b4-5415-42f5-a690-74691c8c5ab6',
  THEMATIC_ROUTE : 'http://linked.toerismevlaanderen.be/id/concepts/06ef75ef-c023-4094-9f23-d7e7f92b1d64',
  GUIDED_TOUR : 'http://linked.toerismevlaanderen.be/id/concepts/5fdc9c43-d20d-4b70-9e08-07cedbfdd932',
  PUBLIC_FACILITY : 'http://linked.toerismevlaanderen.be/id/concepts/eb36c2f7-9ee9-482e-8e88-7b7e731d7e00',
  BOAT : 'http://linked.toerismevlaanderen.be/id/concepts/0b21e67e-8928-49da-99b5-eefc16b6847e',
  SPORT : 'http://linked.toerismevlaanderen.be/id/concepts/a43cea2b-8e82-4d27-831a-33f24cda249f',
  SPA_OR_WELLNESS : 'http://linked.toerismevlaanderen.be/id/concepts/b0740a42-019c-474c-8079-6e6ad3e3a6c0',
  NODE_NETWORK : 'http://linked.toerismevlaanderen.be/id/concepts/9dd33bc9-cbc7-4531-b89d-8d395e405db0'
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
  number_of_hikers_huts: 'aantal wandelaarshutten',
  tva_capacity_description: 'TVA capaciteit'
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
