const https = require('https');
let token = process.argv.slice(2);

module.exports = (type, time_range, limit) => {

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

const getError = (err) => {
    let errMessage = new Error(`sorry, something went wrong with the host ${err.host}. ${err.reason}`);
    return errMessage;
}