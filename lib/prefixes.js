const prefixes = {
  schema: 'http://schema.org/',
  dct: 'http://purl.org/dc/terms/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  adms: 'http://www.w3.org/ns/adms#',
  locn: 'http://www.w3.org/ns/locn#',
  prov: 'http://www.w3.org/ns/prov#',
  wgs: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
  generiek: 'https://data.vlaanderen.be/ns/generiek#',
  adres: 'https://data.vlaanderen.be/ns/adres#',
  organisatie: 'https://data.vlaanderen.be/ns/organisatie#',
  logies: 'https://data.vlaanderen.be/ns/logies#',
  geosparql: 'http://www.opengis.net/ont/geosparql#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  vcard: 'http://www.w3.org/2006/vcard/ns#',
  regorg: 'http://www.w3.org/ns/regorg#',
  mu: 'http://mu.semte.ch/vocabularies/core/',
  ext: 'http://mu.semte.ch/vocabularies/ext/',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
};

const ttlPrefixes = Object.keys(prefixes).map(key => `@prefix ${key}: <${prefixes[key]}> .\n`).join('');
const sparqlPrefixes = Object.keys(prefixes).map(key => `PREFIX ${key}: <${prefixes[key]}> \n`).join('');

export default prefixes;
export {
  prefixes,
  ttlPrefixes,
  sparqlPrefixes
}
