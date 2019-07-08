const recentTracks = (songs) => {
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

const topTracks = (songs) => {
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

const topArtists = (artists) => {
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

module.exports = {recentTracks, topTracks, topArtists}
