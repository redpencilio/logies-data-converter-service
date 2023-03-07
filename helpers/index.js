import { lit } from 'rdflib';
import { XSD } from '../mappers/prefixes';

function hasAnyProp(record, properties) {
  return properties.find((prop) => record[prop] != null) != null;
}

function hasEveryProp(record, properties) {
  return properties.every((prop) => record[prop] != null);
}

function litDateTime(date) {
  return lit(date.toISOString(), undefined, XSD('dateTime'));
}

function isValidURL(value) {
  try {
    const url = new URL(value);
    return true;
  } catch (e) {
    return false;
  }
}

function isSocialMediaUrl(url, socialMediaChannel) {
  // Naive effort to check whether URL is a full social media URL or just an account name
  return url.startsWith('http') && url.includes(socialMediaChannel);
}

function normalizeUrl(url, channel) {
  if (channel?.includes('phone') || channel == 'fax') {
    return `tel:${url.replace(/\s/g, '')}`;
  } else if (channel?.includes('email')) {
    return `mailto:${url}`;
  } else if (channel == 'facebook' && !isSocialMediaUrl(url, 'facebook')) {
    return `http://www.facebook.com/${url}`;
  } else if (channel == 'flickr' && !isSocialMediaUrl(url, 'flickr')) {
    return `http://www.flickr.com/${url}`;
  } else if (channel == 'twitter' && !isSocialMediaUrl(url, 'twitter')) {
    return `http://www.twitter.com/${url}`;
  } else if (channel == 'instagram' && !isSocialMediaUrl(url, 'instagram')) {
    return `http://www.instagram.com/${url}`;
  } else if (url.startsWith('www')) {
    return `http://${url}`;
  } else {
    return url;
  }
}

export {
  hasAnyProp,
  hasEveryProp,
  litDateTime,
  isValidURL,
  normalizeUrl
};
