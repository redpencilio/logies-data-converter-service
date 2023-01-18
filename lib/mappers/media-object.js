import { sym, lit, Statement } from 'rdflib';
import { isValidURL, uriGenerator } from '../helpers';
import { MU, RDF, SCHEMA } from './prefixes';

function mapMediaObjects(recordId, record, field = 'imagesurl') {
  const mediaObjects = [];

  if (record[field]) {
    const urls = record[field].trim().split(',');
    urls.forEach((url) => {
      const value = url.trim();
      if (isValidURL(value)) {
        const { uuid, uri } = uriGenerator.mediaObject(recordId, value);
        const statements = [
          new Statement(sym(uri), RDF('type'), SCHEMA('MediaObject')),
          new Statement(sym(uri), MU('uuid'), lit(uuid)),
          new Statement(sym(uri), SCHEMA('contentUrl'), sym((new URL(value)).href)),
        ];
        mediaObjects.push({ uri, statements });
      } else {
        console.error(`Cannot map invalid image URL '${value}' for record ${recordId}`);
      }
    });
  }

  return mediaObjects;
}

function mapMainMediaObjects(recordId, record) {
  return mapMediaObjects(recordId, record, 'imagesurlmain');
}

export {
  mapMediaObjects,
  mapMainMediaObjects
}
