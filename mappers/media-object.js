import { sym, lit, Statement } from 'rdflib';
import uriGenerator from '../helpers/uri-helpers';
import { isValidURL } from '../helpers';
import { MU, RDF, SCHEMA } from './prefixes';

function mapMediaObjects(recordId, record, errorLogger, field = 'imagesurl') {
  const mediaObjects = [];

  if (record[field]) {
    const urls = record[field].trim().split(',');
    urls.forEach((url) => {
      const value = url.trim();
      if (value) {
        if (isValidURL(value)) {
          const { uuid, uri } = uriGenerator.mediaObject(recordId, value);
          const statements = [
            new Statement(sym(uri), RDF('type'), SCHEMA('MediaObject')),
            new Statement(sym(uri), MU('uuid'), lit(uuid)),
            new Statement(sym(uri), SCHEMA('contentUrl'), sym((new URL(value)).href)),
          ];
          mediaObjects.push({ uri, statements });
        } else {
          errorLogger('invalid image URL', value, recordId);
        }
      }
    });
  }

  return mediaObjects;
}

function mapMainMediaObjects(recordId, record ,errorLogger) {
  return mapMediaObjects(recordId, record, 'imagesurlmain');
}

export {
  mapMediaObjects,
  mapMainMediaObjects
}
