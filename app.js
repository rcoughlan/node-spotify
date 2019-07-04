const https = require('https');
let allArtists = [];

const hitSpotify = (type, time_range, limit) => {

    let path = getPath(type, time_range, limit);

    const options = {
        "method": "GET",
        "hostname": "api.spotfy.com",
        "path": `${path}`,
        "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer BQDKBNCeU9wrbP7dgM_d1aIoZyCPvGpt6MZO170BDou1y6bjkFrCbNA5juKdlsb8317gWKVs3LWy3piKywwCdDIFP4Zs477MPX4p82STf_m7zhDV-KOLct21y0WKQ_0lh3-1tHhQHTVzXoCqxKrgbgA6bt9VQON9I93Efc4Og88C1QQnurI_9J7TSNriY_Rq-HOdo2M9mhfX0rB0HhdLLMLlXyb0EgXPlq0XQ5NOLszFxx4Ka7P0TwUre49RhH0T14GxL5NncscOVimanyK5SsJIOOG4aA5y",
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
                console.log(err.errno);
                // console.log(err);
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
    .catch(err => console.log(err));