import sha256 from 'js-sha256';

const config = {
  registration: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/registrations/',
    uuid(id, decree) { return sha256(`dd7b9b41-ed08-467b-bebf-b4b7aab22291-${id}-${decree}`); },
  },
  lodging: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/lodgings/',
    uuid(id) { return `7e9bf017-aec6-4b27-a21b-0c33cae0ae2e-${id}`; },
  },
  registrationIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    uuid(id, decree) { return sha256(`b1be9263-767e-486a-875e-102dd2e24355-${id}-${decree}`); },
  },
  lodgingIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    uuid(id) { return `8f733017-281a-4b67-b9bb-f6a63529de9b-${id}`; }
  },
  tvlIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    uuid(id) { return `778d140d-e0c4-4dc5-a9e5-972e417d1c01-${id}`; }
  },
  touristAttraction: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/tourist-attractions/',
    uuid(id) { return `881d587d-4b0c-4861-bcc1-dddfca629057-${id}`; }
  },
  geometry: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/geometries/',
    uuid(id) { return `edee7ce8-8992-43c5-8b5c-d415f23a5f8f-${id}`; }
  },
  address: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/addresses/',
    uuid(id) { return `9ebd0cea-10b2-4a86-acd0-93fd479da055-${id}`; }
  },
  quantitativeValue: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/quantitative-values/',
    uuid(id, unit) { return sha256(`9e085686-01af-48c8-850b-e26cd663f699-${id}-${unit}`);}
  },
  rating: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/ratings/',
    uuid(id, type) { return sha256(`1f39ce9d-67e5-47ae-adeb-6617a6b58a7f-${id}-${type}`); }
  },
  qualityLabel: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/quality-labels/',
    uuid(id, label) { return sha256(`a1691130-2b9a-4677-9e1b-74c3c0320709-${id}-${label}`); }
  },
  contactPoint: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/contact-points/',
    uuid(id, channel) { return sha256(`6b0e65e0-42cd-43bb-840b-2262b0f292ba-${id}-${channel}`); }
  },
  mediaObject: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/media-objects/',
    uuid(id, url) { return sha256(`aa65fdc3-5418-432b-9db2-801f9e1ea9cc-${id}-${url}`); }
  },
  description: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/descriptions/',
    uuid(id) { return `b3ec99e8-11c0-4d2e-b7be-99173b603da4-${id}`; }
  },
  accessibilityInformation: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/accessibility-information/',
    uuid(id) { return `b27e43e6-4a6a-48a5-9c6a-75fa09e107ea-${id}`; }
  },
  file: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/files/',
    uuid(id) { return id; }
  },
  dataset: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/datasets/',
    uuid(id) { return id; }
  }
};

const generator = {};
for (const type in config) {
  generator[type] = function() {
    const cfg = config[type];
    const uuid = cfg.uuid(...arguments);
    const uri = `${cfg.baseUri}${uuid}`;
    return {
      uuid,
      uri,
      [`${type}Uuid`]: uuid, // e.g. qualityLabelUuid
      [`${type}Uri`]: uri // e.g. qualityLabelUri
    };
  };
}

export { generator };
