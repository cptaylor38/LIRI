require("dotenv").config();
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');
var axios = require('axios');

var request = process.argv[2];
var userQuery = process.argv[3];

switch (request) {
    case 'spotify-this-song':
        songSearch();
        break;
    case 'move-this':
        movieSearch();
        break;
    case 'do-what-it-says':
        read_txt();
        break;
}

function songSearch() {
    console.log('function reached');
    spotify.search({ type: 'track', query: '' + userQuery }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        else {
            var dataItems = data.tracks.items;
            for (var i = 0; i < dataItems.length; i++) {
                console.log(`
        Artist:         ${data.tracks.items[i].artists[0].name}
        Song Title:     ${data.tracks.items[i].name}
        Song Link       ${data.tracks.items[i].preview_url}
        Album:          ${data.tracks.items[i].album.name}
        --------------------------------------------------------------------
        `);
            }
        }
    });
}

function movieSearch() {
    axios.get("http://www.omdbapi.com/?t=" + `${userQuery}` + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            if (!response) {
                return console.log('null request');
            }
            else {
                console.log(`
            Title:      ${response.data.Title}
            Year:       ${response.data.Year}
            Rated:      ${response.data.Rated}
            Genre:      ${response.data.Genre}
            Director:   ${response.data.Director}
            Writer(s):  ${response.data.Writer}
            Actors:     ${response.data.Actors}
            Plot:       ${response.data.Plot}
            -----------------------------------------------------------
            `);
            }
        }
    );
}
