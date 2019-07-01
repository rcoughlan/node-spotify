const https = require('https');
let allArtists = [];

const hitSpotify = (type, time_range, limit) => {

    let path = getPath(type, time_range, limit);

    const options = {
        "method": "GET",
        "hostname": "api.spotify.com",
        "path": `${path}`,
        "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer BQAwYHaXt_gKCoXVoeAZ0FYG79hHmz40fLEKwcaI5oh6mkBWXleSNaTnWtJdpEMnmAdvw7IK7NDPEZhz0s3SSf8EA2FoyOWHj61y2SKlY0OYpAzQU2H0AqlNDxqvDqXovfsDR3mEZxMVFOQClaG5EhGE8_XHYeKomyaFtlv3B-0axvjgTnInW9JwXPPHPAsPFdoV88-h2Fwa_MeKeLtzSUFfUpF5V5_XK4Mvv2fCFgHjye8p8fYfj5l1TurQmofCxbHH1XOylRKleznpxpyKvVr7Q_1BBj-t",
            "content-length": "0"
        }
    };

    return new Promise((resolve, reject) => {

        try{

            const req = https.get(options, res => {
                let body = '';
                res.on('data', data => {
                    body += data;
                });
                
                res.on('end', () => {
                    let data = JSON.parse(body).items;
                    resolve(data);
                });
            });
        } catch(error){
            reject(console.log('error'));
            // throw error;
        }
            
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
        .catch(console.log('something went wront'));
});

const prom2 = new Promise((resolve, reject) => {
    hitSpotify('artists', '2', 'long_term')
        .then((artists) => {
            topArtistsJSON(artists)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch(console.log('something went wront'));
});

const prom3 = new Promise((resolve, reject) => {
    hitSpotify('recent', 10)
        .then((songs) => {
            recentTracksJSON(songs)
                .then((json) => {
                    resolve(allArtists.push(json));
                })
        })
        .catch(console.log('something went wront'));
});


Promise.all([prom1, prom2, prom3])
    .then(function (values) {
        console.log(allArtists);
    })
    .catch(console.log('something went wront'));