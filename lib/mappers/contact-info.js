import { sym, lit, Statement } from 'rdflib';
import { hasAnyProp, isValidURL, uriGenerator } from '../helpers';
import { tvlOrganizationUri } from '../codelists';
import { FOAF, MU, RDF, SCHEMA } from './prefixes';

function isSocialMediaUrl(url, socialMediaChannel) {
  // Naive effort to check whether URL is a full social media URL or just an account name
  return url.startsWith('http') && url.includes(socialMediaChannel);
}

function mapContactPoints(recordId, record) {
  const channels = {
    'phone1': { predicate: SCHEMA('telephone') },
    'phone2': { predicate: SCHEMA('telephone') },
    'phone3': { predicate: SCHEMA('telephone') },
    'fax': { predicate: SCHEMA('faxNumber') },
    'email': { predicate: SCHEMA('email') },
    'website': { predicate: FOAF('page') },
    'facebook': { predicate: FOAF('page'), name: 'Facebook' },
    'instagram': { predicate: FOAF('page'), name: 'Instagram' },
    'flickr': { predicate: FOAF('page'), name: 'Flickr' },
    'twitter': { predicate: FOAF('page'), name: 'Twitter' },
    'link_to_accessibility_website': { predicate: FOAF('page'), name: 'Toegankelijkheidswebsite' },
  };

  const contactPoints = [];

  for (const channel in channels) {
    let value = record[channel] && record[channel].trim();

    if (value) {
      let url = value;

      if (channel.startsWith('phone') || channel == 'fax') {
        url = `tel:${url.replace(/\s/g, '')}`;
      } else if (channel == 'email') {
        url = `mailto:${url}`;
      } else if (channel == 'facebook' && !isSocialMediaUrl(url, 'facebook')) {
        url = `http://www.facebook.com/${url}`;
      } else if (channel == 'flickr' && !isSocialMediaUrl(url, 'flickr')) {
        url = `http://www.flickr.com/${url}`;
      } else if (channel == 'twitter' && !isSocialMediaUrl(url, 'twitter')) {
        url = `http://www.twitter.com/${url}`;
      } else if (channel == 'instagram' && !isSocialMediaUrl(url, 'instagram')) {
        url = `http://www.instagram.com/${url}`;
      } else if (url.startsWith('www')) {
        url = `http://${url}`;
      }

      if (isValidURL(url)) {
        const { uuid, uri } = uriGenerator.contactPoint(recordId, channel);
        const { predicate, name } = channels[channel];
        const statements = [
          new Statement(sym(uri), RDF('type'), SCHEMA('ContactPoint')),
          new Statement(sym(uri), MU('uuid'), lit(uuid)),
          new Statement(sym(uri), predicate, sym(new URL(url).href))
        ];
        if (name) {
          statements.push(new Statement(sym(uri), FOAF('name'), lit(name)));
        }
        contactPoints.push({ uri, statements });
      } else {
        console.error(`Cannot map invalid ${channel} URL '${value}' for record ${recordId}`);
      }
    }
  };

  return contactPoints;
}

export {
  mapContactPoints
}
