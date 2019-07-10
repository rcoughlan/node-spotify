const assert = require('chai').assert;
const format = require('../format');
const topArtists = require('../topArtists');
const topTracks = require('../topTracks');
const recentTracks = require('../recentTracks');

const formattedTopArtists = [
    {
        artist: 'My Propeller',
        id: '2hmHlBM0kPBm17Y7nVIW9f'
    },
    {
        artist: 'Crying Lightning',
        id: '6wVWJl64yoTzU27EI8ep20'
    }
]

const formattedTopTracks = [
    {
      id: '2hmHlBM0kPBm17Y7nVIW9f',
      track: 'My Propeller',
      artist: 'Arctic Monkeys',
      album: 'Humbug'
    },
    {
      id: '6wVWJl64yoTzU27EI8ep20',
      track: 'Crying Lightning',
      artist: 'Arctic Monkeys',
      album: 'Humbug'
    }
  ]

  const formattedRecentTracks = [
    {
      id: '0omaFOSlS0LIXUJFrCO4uI',
      track: 'Mellow Jazz Docent',
      artist: 'Pavement',
      album: 'Quarantine The Past: The Best Of Pavement'
    },
    {
      id: '04oouwluoI51N1KltgiLUl',
      track: 'Frontwards',
      artist: 'Pavement',
      album: 'Quarantine The Past: The Best Of Pavement'
    }
  ]

describe('Format', () => {
    
    it('should use the topArtists function to return a valid redacted array of json objects', (done) => {
        format.topArtists(topArtists).then((result) => {
            assert.deepEqual(result, formattedTopArtists);
            assert.notDeepEqual(result, topArtists);
            assert.typeOf(result, 'array');
            done();
        })
    })
    
    it('should use the topTracks function to return a valid redacted array of json objects', (done) => {
        format.topTracks(topTracks).then((result) => {
            assert.deepEqual(result, formattedTopTracks);
            assert.notDeepEqual(result, topTracks);
            assert.typeOf(result, 'array');
            done();
        })
    })
    
    it('should use the recentTracks function to return a valid redacted array of json objects', (done) => {
        format.recentTracks(recentTracks).then((result) => {
            assert.deepEqual(result, formattedRecentTracks);
            assert.notDeepEqual(result, recentTracks);
            assert.typeOf(result, 'array');
            done();
        })
    })
})