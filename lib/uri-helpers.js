import sha256 from 'js-sha256';

const registrationBaseUri = 'http://linked.toerismevlaanderen.be/id/registrations/';
const identifierBaseUri = 'http://linked.toerismevlaanderen.be/id/identifiers/';
const lodgingBaseUri = 'http://linked.toerismevlaanderen.be/id/lodgings/';
const geometryBaseUri = 'http://linked.toerismevlaanderen.be/id/geometries/';
const addressBaseUri = 'http://linked.toerismevlaanderen.be/id/addresses/';
const quantitativeValueBaseUri = 'http://linked.toerismevlaanderen.be/id/quantitative-values/';
const ratingBaseUri = 'http://linked.toerismevlaanderen.be/id/ratings/';
const qualityLabelBaseUri = 'http://linked.toerismevlaanderen.be/id/quality-labels/';
const contactPointBaseUri = 'http://linked.toerismevlaanderen.be/id/contact-points/';
const mediaObjectBaseUri = 'http://linked.toerismevlaanderen.be/id/media-objects/';
const descriptionBaseUri = 'http://linked.toerismevlaanderen.be/id/descriptions/';
const fileBaseUri = 'http://linked.toerismevlaanderen.be/id/files/';
const dataDumpBaseUri = 'http://linked.toerismevlaanderen.be/id/data-dumps/';

const registrationUuid = function(id, decree) {
  return sha256(`dd7b9b41-ed08-467b-bebf-b4b7aab22291-${id}-${decree}`);
};

const registrationUri = function(uuid) {
  return `${registrationBaseUri}${uuid}`;
};

const lodgingUuid = function(id) {
  return `7e9bf017-aec6-4b27-a21b-0c33cae0ae2e-${id}`;
};

const lodgingUri = function(uuid) {
  return `${lodgingBaseUri}${uuid}`;
};

const registrationIdentifierUuid = function(id, decree) {
  return sha256(`b1be9263-767e-486a-875e-102dd2e24355-${id}-${decree}`);
};

const lodgingIdentifierUuid = function(id) {
  return `8f733017-281a-4b67-b9bb-f6a63529de9b-${id}`;
};

const identifierUri = function(uuid) {
  return `${identifierBaseUri}${uuid}`;
};

const geometryUuid = function(id) {
  return `edee7ce8-8992-43c5-8b5c-d415f23a5f8f-${id}`;
};

const geometryUri = function(uuid) {
  return `${geometryBaseUri}${uuid}`;
};

const addressUuid = function(id) {
  return `9ebd0cea-10b2-4a86-acd0-93fd479da055-${id}`;
};

const addressUri = function(uuid) {
  return `${addressBaseUri}${uuid}`;
};

const quantitativeValueUuid = function(id, unit) {
  return sha256(`9e085686-01af-48c8-850b-e26cd663f699-${id}-${unit}`);
};

const quantitativeValueUri = function(uuid) {
  return `${quantitativeValueBaseUri}${uuid}`;
};

const ratingUuid = function(id, type) {
  return sha256(`1f39ce9d-67e5-47ae-adeb-6617a6b58a7f-${id}-${type}`);
};

const ratingUri = function(uuid) {
  return `${ratingBaseUri}${uuid}`;
};

const qualityLabelUuid = function(id, label) {
  return sha256(`a1691130-2b9a-4677-9e1b-74c3c0320709-${id}-${label}`);
};

const qualityLabelUri = function(uuid) {
  return `${qualityLabelBaseUri}${uuid}`;
};

const contactPointUuid = function(id, channel) {
  return sha256(`6b0e65e0-42cd-43bb-840b-2262b0f292ba-${id}-${channel}`);
};

const contactPointUri = function(uuid) {
  return `${contactPointBaseUri}${uuid}`;
};

const mediaObjectUuid = function(id, url) {
  return sha256(`aa65fdc3-5418-432b-9db2-801f9e1ea9cc-${id}-${url}`);
};

const mediaObjectUri = function(uuid) {
  return `${mediaObjectBaseUri}${uuid}`;
};

const descriptionUuid = function(id) {
  return `b3ec99e8-11c0-4d2e-b7be-99173b603da4-${id}`;
};

const descriptionUri = function(uuid) {
  return `${descriptionBaseUri}${uuid}`;
};

const fileUri = function(uuid) {
  return `${fileBaseUri}${uuid}`;
};

const dataDumpUri = function(uuid) {
  return `${dataDumpBaseUri}${uuid}`;
};

const generator = {
  registrationUuid,
  registrationUri,
  lodgingUuid,
  lodgingUri,
  registrationIdentifierUuid,
  lodgingIdentifierUuid,
  identifierUri,
  geometryUuid,
  geometryUri,
  addressUuid,
  addressUri,
  quantitativeValueUuid,
  quantitativeValueUri,
  ratingUuid,
  ratingUri,
  qualityLabelUuid,
  qualityLabelUri,
  contactPointUuid,
  contactPointUri,
  mediaObjectUuid,
  mediaObjectUri,
  descriptionUuid,
  descriptionUri,
  fileUri,
  dataDumpUri
};

export { generator }
