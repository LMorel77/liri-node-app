// A Node.js App Called LIRI
require('dotenv').config();

var dotenv = require('dotenv');
var file = require('fs');
var keys = require('./keys.js');
var request = require('request');
var spotify = require('node-spotify-api');
var twitter = require('twitter');

var command = process.argv[2];
var parameter = process.argv[3];
var logData; // To store log.txt data...bonus activity

var spotifyApp = new spotify(keys.spotify);
var twitterApp = new twitter(keys.twitter);

// Function to Display Error Message
function displayError() {

    console.log('');
    console.log('Oops, something went wrong. Please check your spelling and try again.')
    console.log('');
    console.log('==========================================================');

};

// Function to Retrieve Movie Info
function fetchMovie(movieName) {

    var queryURL = 'http://www.omdbapi.com/?apikey=trilogy&plot=short&t=' + movieName;
    request(queryURL, function (error, response, body) {

        console.log('');
        console.log('======================= Movie Info =======================');
        console.log('');
        var status = JSON.parse(body).Response;
        if (!error && status == 'True' && response.statusCode == 200) {
            var movieInfo = JSON.parse(body);
            console.log('Title: ', movieInfo.Title);
            console.log('Released: ', movieInfo.Year);
            console.log('IMDB Rating: ', movieInfo.imdbRating);
            var ratings = movieInfo.Ratings;
            var rottenTomatoesRating;
            for (let i = 0; i < ratings.length; i++) {
                if (ratings[i].Source == 'Rotten Tomatoes') {
                    rottenTomatoesRating = ratings[i].Value;
                }
            }
            if (rottenTomatoesRating != undefined) {
                console.log('Rotten Tomatoes Rating: ', rottenTomatoesRating);
            }
            else {
                console.log('Rotten Tomatoes Rating: Unavailable');
            }
            console.log('Countries: ', movieInfo.Country);
            console.log('Languages: ', movieInfo.Language);
            console.log('Plot: ', movieInfo.Plot);
            console.log('Actors: ', movieInfo.Actors);
            console.log('');
            console.log('==========================================================');
        }
        else {
            displayError();
        }

    });

};

// Function to Retrieve Songs
function fetchTracks(trackName) {

    spotifyTrackURL = 'https://open.spotify.com/track/';
    if (trackName === 'The Sign') {
        spotifyApp.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function (data) {
                console.log('');
                console.log('========================= Spotify =========================');
                console.log('');
                console.log('Song Name:', data.name);
                var artistInfo = data.artists;
                var artistNames = [];
                for (let i = 0; i < artistInfo.length; i++) {
                    artistNames.push(artistInfo[i].name);
                }
                console.log('Artists:', artistNames.join(', '));
                console.log('Album:', data.album.name);
                console.log('Spotify Preview Link:', data.preview_url);
                console.log('Spotify Link:', spotifyTrackURL + data.id);
                console.log('');
                console.log('===========================================================');
            })
            .catch(function (err) {
                console.error('Oops, something went wrong: ' + err);
            });
    }
    else {
        spotifyApp.search({ type: 'track', query: trackName }, function (err, data) {
            if (err) {
                return console.log('Oops, something went wrong: ' + err);
            }
            else {
                console.log('');
                console.log('========================= Spotify =========================');
                console.log('');
                var musicInfo = data.tracks.items;
                for (let i = 0; i < musicInfo.length; i++) {
                    if (musicInfo[i].name = trackName) {
                        console.log('Song Name:', musicInfo[i].name);
                        var artistInfo = musicInfo[i].artists;
                        var artistNames = [];
                        for (let i2 = 0; i2 < artistInfo.length; i2++) {
                            artistNames.push(artistInfo[i2].name);
                        }
                        console.log('Artists:', artistNames.join(', '));
                        console.log('Album:', musicInfo[i].album.name);
                        console.log('Spotify Preview Link:', musicInfo[i].preview_url);
                        console.log('Spotify Link:', spotifyTrackURL + musicInfo[i].id);
                        console.log('');
                    }
                };
                console.log('===========================================================');
            }
        });
    };
};

// Function to Process Commands in Random.txt File
function processFile() {

    file.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var fileData = data.split(",");

        for (let i = 0; i < fileData.length; i += 2) {

            if (fileData[i] === 'movie-this') {
                fetchMovie(fileData[i + 1]);
            }
            else if (fileData[i] === 'spotify-this-song') {
                fetchTracks(fileData[i + 1]);
            }
            else {
                console.log('');
                console.log('=================== Application Error ====================');
                displayError();
            }

        };

    });

};

// Processing LIRI Commands
if (command === 'movie-this') {
    if (parameter === undefined) {
        fetchMovie('Mr-Nobody');
    }
    else {
        fetchMovie(parameter.replace(/\s+/g, '-'));
    }
}
else if (command === 'my-tweets') {
    console.log('');
    console.log('======================== Twitter =========================');
    console.log('');
    twitterApp.get('statuses/user_timeline', { q: 'nodejs', count: 20 }, function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length; i++) {
                console.log("Tweet: ", tweets[i].text);
                console.log("Date/time: ", tweets[i].created_at);
                console.log('');
            }
            console.log('==========================================================');
        }
        else {
            displayError();
        }
    });
}
else if (command === 'spotify-this-song') {
    if (parameter === undefined) {
        fetchTracks('The Sign');
    }
    else {
        fetchTracks(parameter);
    }
}
else if (command === 'do-what-it-says') {
    console.log('');
    console.log('===================== Processing File =====================');
    console.log('');
    processFile();
}
else {
    console.log('');
    console.log('=================== Application Error ====================');
    displayError();
}
