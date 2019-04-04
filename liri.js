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
        songSearch(userQuery);
        break;
    case 'movie-this':
        if (!userQuery) {
            userQuery = 'Mr. Nobody';
        }
        movieSearch(userQuery);
        break;
    case 'concert-this':
        bandSearch(userQuery);
        break;
    case 'do-what-it-says':
        readRandom(userQuery);
        break;
}

function songSearch(userQuery) {
    console.log('function reached');
    spotify.search({ type: 'track', query: '' + userQuery }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        else {
            var dataItems = data.tracks.items;

            for (var i = 0; i < dataItems.length; i++) {

                var dataString = `
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

                });

            }
        }
    });
}

function movieSearch(userQuery) {
    console.log('movieSearch function ran');
    axios.get(`http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`).then(
        function (response) {
            if (!response) {
                return console.log('null request');
            }
            else {

                var dataString = `
Title:          ${response.data.Title}
Year:           ${response.data.Year}
Rated:          ${response.data.Rated}
Genre:          ${response.data.Genre}
Director:       ${response.data.Director}
Writer(s):      ${response.data.Writer}
Actors:         ${response.data.Actors}
Plot:           ${response.data.Plot}
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

function bandSearch(userQuery) {
    axios.get(`https://rest.bandsintown.com/artists/${userQuery}/events?app_id=codingbootcamp`).then(
        function (response) {
            if (!response) {
                return console.log('null request');
            }
            else {
                for (var i = 0; i < response.data.length; i++) {

                    var dataString = `
Venue:      ${response.data[i].venue.name}
City:       ${response.data[i].venue.city}
Date:       ${moment(response.data[i].datetime, ["YYYY", moment.ISO_8601]).format('MM-DD-YYYY hh:mm a')}
---------------------------------------------------
                    `
                    console.log(dataString);
                    fs.appendFile("log.txt", dataString, function (err) {

                        if (err) {
                            console.log(err);
                        }

                    });
                }
            }
        }
    )
}

function readRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        console.log(data);

        var dataArr = data.split(",");

        var request = dataArr[0];
        var query = dataArr[1];

        switch (request) {
            case 'spotify-this-song':
                songSearch(query);
                break;
            case 'movie-this':
                movieSearch(query);
                break;
            case 'concert-this':
                bandSearch(query);
                break;
            case 'do-what-it-says':
                read_txt();
                break;
        }

    });
}
