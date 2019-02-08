import { mapBaseRegistry, mapTvaRegistry } from '../lib/logies-mapper';

export default [
  // {
  //   title: 'Base registry',
  //   inputFile: '/input/base_registry.csv',
  //   url: 'http://opendata.visitflanders.org/sector/accommodation/base_registry.csv?limit=-1',
  //   outputFile: '/tmp/base_registry.ttl',
  //   mapper: mapBaseRegistry
  // },
  {
    title: 'Hotels v2',
    inputFile: '/input/hotels_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/hotels_v2.csv?limit=-1',
    outputFile: '/tmp/hotels_v2.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'Vakantieparken v2',
    inputFile: '/input/vakantieparken_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/holiday-parks_v2.csv?limit=-1',
    outputFile: '/tmp/vakantieparken_v2.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'Vakantiewoningen v2',
    inputFile: '/input/vakantiewoningen_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/holiday-cottages_v2.csv?limit=-1',
    outputFile: '/tmp/vakantiewoningen_v2.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'Campings v2',
    inputFile: '/input/campings_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/campings_v2.csv?limit=-1',
    outputFile: '/tmp/campings_v2.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'Camperterreinen v2',
    inputFile: '/input/camperterreins_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/camper-terrain_v2.csv?limit=-1',
    outputFile: '/tmp/camperterreinen_v2.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'B&B v2',
    inputFile: '/input/b&b_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/b&b_v2.csv?limit=-1',
    outputFile: '/tmp/b&b_v2.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'Hostels v2',
    inputFile: '/input/hostels_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/hostels_v2.csv?limit=-1',
    outputFile: '/tmp/hostels_v2.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'Kamergebonden logies v2',
    inputFile: '/input/generic-rooms_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/generic-rooms_v2.csv?limit=-1',
    outputFile: '/tmp/generic-rooms_v2.ttl',
    mapper: mapBaseRegistry
  },
  {
    title: 'Terreingebonden logies v2',
    inputFile: '/input/generic-terrain_v2.csv',
    url: 'http://opendata.visitflanders.org/tourist/accommodation/generic-terrain_v2.csv?limit=-1',
    outputFile: '/tmp/generic-terrain_v2.ttl',
    mapper: mapBaseRegistry
  },  
  {
    title: 'TVA registry',
    inputFile: '/input/tva-registry.csv',
    url: 'http://opendata.visitflanders.org/sector/accommodation/tva-registry.csv?limit=-1',
    outputFile: '/tmp/tva_registry.ttl',
    mapper: mapTvaRegistry
  }
];
