import { ttlPrefixes } from './prefixes';
import { generator as uriGenerator } from './uri-helpers';

function toTtl(statements) {
  console.log(`Mapped ${statements.length} rows`);
  const data = statements.join('');
  const ttl = `${ttlPrefixes}\n${data}`;
  return ttl;
};

export {
  toTtl,
  uriGenerator
};
