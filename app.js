const api = require('./api');
const format = require('./format');
let allArtists = [];

const topTracks = new Promise((resolve, reject) => {
    api.hitSpotify('tracks', 4, 'short_term')
        .then((songs) => {
            format.topTracks(songs)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch((err) => {
            reject(err)
        });
});

const topArtists = new Promise((resolve, reject) => {
    api.hitSpotify('artists', 2, 'long_term')
        .then((artists) => {
            format.topArtists(artists)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch(err => reject(err));
});

const recentTracks = new Promise((resolve, reject) => {
    api.hitSpotify('recent', 2)
        .then((songs) => {
            format.recentTracks(songs)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch(err => reject(err));
});


Promise.all([topTracks, topArtists, recentTracks])
    .then(function (values) {
        console.log(allArtists);
    })
    .catch(err => console.log(err));