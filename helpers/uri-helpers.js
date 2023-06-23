import sha256 from 'js-sha256';
import { uuid, sparqlEscapeUri, sparqlEscapeString } from 'mu';
import { querySudo as query, updateSudo as update } from '@lblod/mu-auth-sudo';
import queue from 'queue';
import { BATCH_SIZE } from '../config/env';

const URI_MAPPING_GRAPH = process.env.URI_MAPPING_GRAPH || 'http://mu.semte.ch/graphs/uri-mapping';

class UriGenerator {
  constructor() {
    this.uriMap = {};
    this.queue = queue({
      concurrency: 1,
      autostart: true,
      results: [],
    });
    this.queue.start();
  }

  async init() {
    console.log('Fetch URI mappings from triplestore');
    await this.loadInMemory();

    for (const type in config) {
      this[type] = function() {
        const cfg = config[type];
        const tvlId = cfg.tvlId(...arguments);
        const { uri, uuid: muId } = this.lookup(tvlId, cfg);
        return {
          uuid: muId,
          uri,
          [`${type}Uuid`]: muId, // e.g. qualityLabelUuid
          [`${type}Uri`]: uri // e.g. qualityLabelUri
        };
      };
    }

    console.log(`URI generator has been initialized`);
  }

  lookup(id, cfg) {
    let result = this.uriMap[id];
    if (!result) {
      const muId = uuid();
      const uri = `${cfg.baseUri}${muId}`;
      this.uriMap[id] = { uri, uuid: muId };
      this.queue.push(() => this.save(id, muId, uri));
      return { uri, uuid: muId };
    } else {
      return result;
    }
  }

  async loadInMemory() {
    const countResult = await query(`
      SELECT (COUNT(DISTINCT ?s) as ?count) WHERE {
        GRAPH ${sparqlEscapeUri(URI_MAPPING_GRAPH)} {
          ?s ?p ?o .
        }
      }
    `);

    const count = parseInt(countResult.results.bindings[0].count.value);
    console.log(`Found ${count} URI mapping triples in graph <${URI_MAPPING_GRAPH}>. Going to load them in memory.`);
    const limit = BATCH_SIZE;
    const totalBatches = Math.ceil(count / limit);

    let currentBatch = 0;
    while (currentBatch < totalBatches) {
      console.log(`Loading batch ${currentBatch + 1}/${totalBatches} of URI mapping triples in memory.`);
      const result = await query(`
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      SELECT ?s ?tvlId ?muId WHERE {
        SELECT ?s ?tvlId ?muId WHERE {
          GRAPH ${sparqlEscapeUri(URI_MAPPING_GRAPH)} {
            ?s ext:hasUuid ?muId ; ext:hasTvlId ?tvlId .
          }
        } LIMIT ${limit} OFFSET ${currentBatch * limit}
      }`);
      currentBatch++;

      for (let binding of result.results.bindings) {
        const uri = binding['s'].value;
        const tvlId = binding['tvlId'].value;
        const muId = binding['muId'].value;
        this.uriMap[tvlId] = { uri, uuid: muId };
      }
    }
  }

  async save(id, muId, uri) {
    await update(`
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      INSERT DATA {
        GRAPH ${sparqlEscapeUri(URI_MAPPING_GRAPH)} {
          ${sparqlEscapeUri(uri)} ext:hasUuid ${sparqlEscapeString(muId)} ;
              ext:hasTvlId ${sparqlEscapeString(id)} .
        }
      }
    `);
  }
}

const config = {
  registration: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/registrations/',
    tvlId(id, decree) { return sha256(`dd7b9b41-ed08-467b-bebf-b4b7aab22291-${id}-${decree}`); },
  },
  lodging: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/lodgings/',
    tvlId(id) { return `7e9bf017-aec6-4b27-a21b-0c33cae0ae2e-${id}`; },
  },
  registrationIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    tvlId(id, decree) { return sha256(`b1be9263-767e-486a-875e-102dd2e24355-${id}-${decree}`); },
  },
  generation: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/generations/',
    tvlId(id, decree) { return sha256(`b6981a14-18df-40c3-a85a-3b471072d3a8-${id}-${decree}`); },
  },
  invalidation: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/invalidations/',
    tvlId(id, decree) { return sha256(`f01118a5-40d7-45f9-ada7-70e09e8ce239}-${id}-${decree}`); },
  },
  lodgingIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    tvlId(id) { return `8f733017-281a-4b67-b9bb-f6a63529de9b-${id}`; }
  },
  tvlIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    tvlId(id) { return `778d140d-e0c4-4dc5-a9e5-972e417d1c01-${id}`; }
  },
  tvaIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    tvlId(id) { return `4bd10a46-3a75-4a27-b6fb-49daa951687d-${id}`; }
  },
  fodIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    tvlId(id) { return `4d96366f-5477-4b36-8258-8d40f4851bf9-${id}`; }
  },
  organisationIdentifier: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/identifiers/',
    tvlId(id) { return `68ce3d98-3ed0-49e5-bfe3-578ad027167e-${id}`; }
  },
  organisation: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/organisations/',
    tvlId(id, type) { return sha256(`809ea6e8-c2cb-4f3d-a1d4-954aeeab4aa9-${id}`); }
  },
  touristAttraction: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/tourist-attractions/',
    tvlId(id) { return `881d587d-4b0c-4861-bcc1-dddfca629057-${id}`; }
  },
  geometry: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/geometries/',
    tvlId(id) { return `edee7ce8-8992-43c5-8b5c-d415f23a5f8f-${id}`; }
  },
  address: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/addresses/',
    tvlId(id, type) {
      return type
        ? sha256(`9ebd0cea-10b2-4a86-acd0-93fd479da055-${id}-${type})`)
        : `9ebd0cea-10b2-4a86-acd0-93fd479da055-${id}`;
    }
  },
  quantitativeValue: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/quantitative-values/',
    tvlId(id, unit) { return sha256(`9e085686-01af-48c8-850b-e26cd663f699-${id}-${unit}`);}
  },
  propertyValue: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/property-values/',
    tvlId(id, unit) { return sha256(`94a1e7f5-328b-4e9b-a844-8561609a03f7-${id}-${unit}`);}
  },
  rating: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/ratings/',
    tvlId(id, type) { return sha256(`1f39ce9d-67e5-47ae-adeb-6617a6b58a7f-${id}-${type}`); }
  },
  qualityLabel: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/quality-labels/',
    tvlId(id, label) { return sha256(`a1691130-2b9a-4677-9e1b-74c3c0320709-${id}-${label}`); }
  },
  permit: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/permits/',
    tvlId(id, label) { return sha256(`4117607d-f107-4c07-b0d1-4eb58f2505fd-${id}-${label}`); }
  },
  contactPoint: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/contact-points/',
    tvlId(id, channel) { return sha256(`6b0e65e0-42cd-43bb-840b-2262b0f292ba-${id}-${channel}`); }
  },
  mediaObject: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/media-objects/',
    tvlId(id, url) { return sha256(`aa65fdc3-5418-432b-9db2-801f9e1ea9cc-${id}-${url}`); }
  },
  description: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/descriptions/',
    tvlId(id, label) { return sha256(`b3ec99e8-11c0-4d2e-b7be-99173b603da4-${id}-${label}`); }
  },
  accessibilityInformation: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/accessibility-information/',
    tvlId(id) { return `b27e43e6-4a6a-48a5-9c6a-75fa09e107ea-${id}`; }
  },
  file: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/files/',
    tvlId(id) { return id; }
  },
  dataset: {
    baseUri: 'http://linked.toerismevlaanderen.be/id/datasets/',
    tvlId(id) { return id; }
  }
};

const singleton = new UriGenerator();
export default singleton;
