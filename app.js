const https = require('https');
let allArtists = [];
// let artists_short = [];
// let artists_medium = [];
// let artists_long = [];

const hitSpotify = (type, time_range, limit, offset) => {

    this.type = type;
    this.time_range = time_range;
    this.limit = limit;
    this.offset = offset;

    const options = {
        "method": "GET",
        "hostname": "api.spotify.com",
        "port": null,
        "path": `/v1/me/top/${type}?time_range=${time_range}&limit=${limit}`,
        "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer BQD7LVJxMiHH2z-RnsgzGimDMsdOeStsq8O1K2oX-Iw-LSyf8IiInaCj8l-Ul_auAzi11PXgqjvSoJcCYPgFagmy7viUC9skMFGvvGtzcaxd0mWn9m18_xGz-5PvfgRqHorVdirWKAGu48Zk-KMr401322pl6ETtadmc3tzZJ2BGU0R2w7DeSGc8NCI_nc3xBFZKVuF3RFc1v2y6mUvxUBbhPGvoWkCr2ElFvbEmwnstj4vZ-YsqFLfhfDYejntkWRceJqSEdUVwU33yHaIMncx4yObGpvFg",
            "content-length": "0"
        }
    };

    const req = https.get(options, res => {
        let body = '';
        res.on('data', data => {
            body += data;
        });

        res.on('end', () => {
            const artists = JSON.parse(body).items;
            let counter = 0;
            for (artist in artists) {
                counter += 1;
                // console.log(counter, artists[artist].artists[0].name, artists[artist].name);
                // console.log(counter, artists[artist].name);
                // console.log(counter, artists[artist].artists[0].name);
                allArtists.push(artists[artist].artists[0].name)
            }
        });
    });
}

hitSpotify('tracks', 'short_term', '50', '0');
hitSpotify('tracks', 'medium_term', '50', '0');
hitSpotify('tracks', 'long_term', '50', '0');

setTimeout(()=> console.log(allArtists), 10000)
// artists_short = hitSpotify('tracks', 'long_term', '50', '0');
// artists_medium = hitSpotify('tracks', 'medium_term', '50', '0');
// artists_long = hitSpotify('tracks', 'long_term', '50', '0');
// let artists = artists_short.concat(artists_medium, artists_long);
