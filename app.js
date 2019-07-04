const https = require('https');
let allArtists = [];

const hitSpotify = (type, time_range, limit) => {

    let path = getPath(type, time_range, limit);

    const options = {
        "method": "GET",
        "hostname": "api.spify.com",
        "path": `${path}`,
        "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer BQCGWDDik70rr6vwLboaDuE-PORaxhLIJlRYEVZ5b_k6Hl8hS0Vxdx-2Qu09HbQN6hojYGSKC64tpTDrrmXCij1B-rzg7f1YSZihcDqDWsC1rzw8gVUescjQgpQe6fOXwiFBtvhvrK5ecQoX2u-i3L2GZqbc8PQp1Lva-_vkFqUgyJq23ZKQVvL6-5mD2wwa0Dcqj-iHkqKJ6PGSRIq6BidzuH_K6USC0C_GDc4GJn-MoQ7qSowhbEh9rRkxsnoEh2TPuDGiuAFT-_a1BC8jU0RDzza95yuo",
            "content-length": "0"
        }
    };

    return new Promise((resolve, reject) => {
            let req = https.request(options, res => {
                let body = '';
                res.on('data', data => {
                    body += data;
                });
                
                res.on('end', () => {
                    let data = JSON.parse(body).items;
                    resolve(data);
                });
            });
            
            req.on('error', (err) => {
                let errMessage = getError(err)
                // console.error(errMessage);
                throw errMessage;
                reject(errMessage);
            })

            req.end();
    });
}

const getPath = (type, limit, time_range) => {
    if (type === 'recent') {
        return `/v1/me/player/recently-played?limit=${limit}`
    } else if (type === 'artists') {
        return `/v1/me/top/artists?time_range=${time_range}&limit=${limit}`
    } else if (type === 'tracks') {
        return `/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`
    }
}

const recentTracksJSON = (songs) => {
    let songsArray = [];

    return new Promise((resolve, reject) => {

        for (song in songs) {
            let trackJSON = {
                "id": songs[song].track.id,
                "track": songs[song].track.name,
                "artist": songs[song].track.artists[0].name,
                "album": songs[song].track.album.name
            }

            songsArray.push(trackJSON);
        }

        resolve(songsArray);
    });
}

const topTracksJSON = (songs) => {
    let songsArray = [];

    return new Promise((resolve, reject) => {

        for (song in songs) {
            let trackJSON = {
                "id": songs[song].id,
                "track": songs[song].name,
                "artist": songs[song].artists[0].name,
                "album": songs[song].album.name
            }

            songsArray.push(trackJSON);
        }

        resolve(songsArray);
    });
}

const topArtistsJSON = (artists) => {
    let artistsArray = [];

    return new Promise((resolve, reject) => {

        for (artist in artists) {
            let artistsJSON = {
                "artist": artists[artist].name,
                "id": artists[artist].id
            }

            artistsArray.push(artistsJSON);
        }

        resolve(artistsArray);
    });
}

const getError = (err) => {
    let errMessage = new Error(`sorry, something went wrong with the host ${err.host}. ${err.reason}`);
    return errMessage;
}

const prom1 = new Promise((resolve, reject) => {
    hitSpotify('tracks', 4, 'short_term')
        .then((songs) => {
            for (song in songs) {
                topTracksJSON(songs)
                    .then((json) => {
                        resolve(allArtists.push(json));
                    })
            }
        })
        .catch((err) => {
            console.log('here I am')
            reject(err)
        });
});

const prom2 = new Promise((resolve, reject) => {
    hitSpotify('artists', '2', 'long_term')
        .then((artists) => {
            topArtistsJSON(artists)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch(err => reject('err'));
});

const prom3 = new Promise((resolve, reject) => {
    hitSpotify('recent', 10)
        .then((songs) => {
            recentTracksJSON(songs)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch(err => reject('err'));
});


Promise.all([prom1, prom2, prom3])
    .then(function (values) {
        console.log(allArtists);
        // console.log(allArtists.length);
    })
    .catch(err => console.log(' something hereerr'));