import sha256 from 'js-sha256';

const registrationBaseUri = 'http://linked.toerismevlaanderen.be/id/registrations/';
const identifierBaseUri = 'http://linked.toerismevlaanderen.be/id/identifiers/';
const lodgingBaseUri = 'http://linked.toerismevlaanderen.be/id/lodgings/';
const pointBaseUri = 'http://linked.toerismevlaanderen.be/id/points/';
const addressBaseUri = 'http://linked.toerismevlaanderen.be/id/addresses/';
const quantitativeValueBaseUri = 'http://linked.toerismevlaanderen.be/id/quantitative-values/';
const ratingBaseUri = 'http://linked.toerismevlaanderen.be/id/ratings/';
const fileBaseUri = 'http://linked.toerismevlaanderen.be/id/files/';
const dataDumpBaseUri = 'http://linked.toerismevlaanderen.be/id/data-dumps/';

const generateRegistrationUuid = function(id) {
  return `dd7b9b41-ed08-467b-bebf-b4b7aab22291-${id}`;
};

const generateRegistrationUri = function(uuid) {
  return `${registrationBaseUri}${uuid}`;
};

const generateLodgingUuid = function(id) {
  return `7e9bf017-aec6-4b27-a21b-0c33cae0ae2e-${id}`;
};

const generateLodgingUri = function(uuid) {
  return `${lodgingBaseUri}${uuid}`;
};

const generateRegistrationIdentifierUuid = function(id) {
  return `b1be9263-767e-486a-875e-102dd2e24355-${id}`;
};

const generateLodgingIdentifierUuid = function(id) {
  return `8f733017-281a-4b67-b9bb-f6a63529de9b-${id}`;
};

const generateIdentifierUri = function(uuid) {
  return `${identifierBaseUri}${uuid}`;
};

const generatePointUuid = function(id) {
  return `edee7ce8-8992-43c5-8b5c-d415f23a5f8f-${id}`;
};

const generatePointUri = function(uuid) {
  return `${pointBaseUri}${uuid}`;
};

const generateAddressUuid = function(id) {
  return `9ebd0cea-10b2-4a86-acd0-93fd479da055-${id}`;
};

const generateAddressUri = function(uuid) {
  return `${addressBaseUri}${uuid}`;
};

const generateQuantitativeValueUuid = function(id, unit) {
  return sha256(`9e085686-01af-48c8-850b-e26cd663f699-${id}-${unit}`);
};

const generateQuantitativeValueUri = function(uuid) {
  return `${quantitativeValueBaseUri}${uuid}`;
};

const generateRatingUuid = function(id) {
  return `1f39ce9d-67e5-47ae-adeb-6617a6b58a7f-${id}`;
};

const generateRatingUri = function(uuid) {
  return `${ratingBaseUri}${uuid}`;
};

const generateContactPointUuid = function(id, channel) {
  return sha256(`6b0e65e0-42cd-43bb-840b-2262b0f292ba-${id}-${channel}`);
};

const generateContactPointUri = function(uuid) {
  return `${quantitativeValueBaseUri}${uuid}`;
};

const generateFileUri = function(uuid) {
  return `${fileBaseUri}${uuid}`;
};

const generateDataDumpUri = function(uuid) {
  return `${dataDumpBaseUri}${uuid}`;
};

export {
  generateRegistrationUuid,
  generateRegistrationUri,
  generateLodgingUuid,
  generateLodgingUri,
  generateRegistrationIdentifierUuid,
  generateLodgingIdentifierUuid,
  generateIdentifierUri,
  generatePointUuid,
  generatePointUri,
  generateAddressUuid,
  generateAddressUri,
  generateQuantitativeValueUuid,
  generateQuantitativeValueUri,
  generateRatingUuid,
  generateRatingUri,
  generateContactPointUuid,
  generateContactPointUri,
  generateFileUri,
  generateDataDumpUri
}