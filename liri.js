require("dotenv").config();
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
// moment().format();


var request = process.argv[2];
var userQuery = process.argv[3];

switch (request) {
    case 'spotify-this-song':
        if (!userQuery) {
            userQuery = 'The Sign';
        }
        songSearch();
        break;
    case 'movie-this':
        if (!userQuery) {
            userQuery = 'Mr. Nobody';
        }
        movieSearch();
        break;
    case 'concert-this':
        bandSearch();
        break;
    case 'do-what-it-says':
        readRandom();
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

                dataString = `
                Artist:         ${dataItems[i].artists[0].name}
                Song Title:     ${dataItems[i].name}
                Song Link       ${dataItems[i].preview_url}
                Album:          ${dataItems[i].album.name}
                -------------------------------------------------------------
                `
                console.log(dataString);
                fs.appendFile("log.txt", dataString, function (err) {

                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log("Content Added!");
                    }

                });

            }


        }
    });
}

function movieSearch() {
    console.log('movieSearch function ran');
    axios.get(`http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`).then(
        function (response) {
            if (!response) {
                return console.log('null request');
            }
            else {

                var dataString = `
            Title:      ${response.data.Title}
            Year:       ${response.data.Year}
            Rated:      ${response.data.Rated}
            Genre:      ${response.data.Genre}
            Director:   ${response.data.Director}
            Writer(s):  ${response.data.Writer}
            Actors:     ${response.data.Actors}
            Plot:       ${response.data.Plot}
            ----------------------------------------------------------
            `
                console.log(dataString);
                fs.appendFile("log.txt", dataString, function (err) {

                    if (err) {
                        console.log(err);
                    }

                    else {
                        console.log("Content Added!");
                    }

                });

            }
        }
    );
}

function bandSearch() {
    axios.get(`rest.bandsintown.com / artists / ${userQuery}`).then(
        function (response) {
            if (!response) {
                return console.log('null request');
            }
            else {
                console.log(response);
            }
        }
    )
}

function readRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        var request = dataArr[0];
        var query = dataArr[1];

        // We will then re-display the content as an array for later use.
        switch (request) {
            case 'spotify-this-song':
                songSearch(query);
                break;
            case 'movie-this':
                movieSearch(query);
                break;
            case 'do-what-it-says':
                read_txt();
                break;
        }

    });
}
