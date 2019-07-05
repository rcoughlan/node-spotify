const https = require('https');
let allArtists = [];
let token = process.argv.slice(2);

const hitSpotify = (type, time_range, limit) => {

    let path = getPath(type, time_range, limit);

    const options = {
        "method": "GET",
        "hostname": "api.spotify.com",
        "path": `${path}`,
        "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": `Bearer ${token}`,
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

const topTracks = new Promise((resolve, reject) => {
    hitSpotify('tracks', 4, 'short_term')
        .then((songs) => {
            topTracksJSON(songs)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch((err) => {
            console.log('here I am')
            reject(err)
        });
});

const topArtists = new Promise((resolve, reject) => {
    hitSpotify('artists', '2', 'long_term')
        .then((artists) => {
            topArtistsJSON(artists)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch(err => reject('err'));
});

const recentTracks = new Promise((resolve, reject) => {
    hitSpotify('recent', 10)
        .then((songs) => {
            recentTracksJSON(songs)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch(err => reject('err'));
});


Promise.all([topTracks, topArtists, recentTracks])
    .then(function (values) {
        console.log(allArtists);
    })
    .catch(err => console.log(' something hereerr'));