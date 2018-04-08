// A Node.js App
require('dotenv').config();

var dotenv = require('dotenv');
var keys = require('./keys.js');
var request = require('request');
var spotify = require('node-spotify-api');
var twitter = require('twitter');

var command = process.argv[2];
var parameter = process.argv[3];

var spotifyApp = new spotify(keys.spotify);
var twitterApp = new twitter(keys.twitter);

function displayError() {

    console.log('');
    console.log('Oops, something went wrong. Please check your spelling and try again.')
    console.log('');
    console.log('==========================================================');

}

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

    })

}

if (parameter != undefined) {
    parameter = process.argv[3].trim().replace(/\s+/g, '');
}

if (command === 'movie-this') {
    if (parameter === undefined) {
        fetchMovie('Mr.Nobody');
    }
    else {
        fetchMovie(parameter);
    }
}
else if (command === 'my-tweets') {
    console.log('');
    console.log('======================== Twitter =========================');
    console.log('');
    twitterApp.get('statuses/user_timeline', {q: 'nodejs', count: 20}, function (error, tweets, response) {

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
    console.log("This is the Spotify condition");
}
else if (command === 'do-what-it-says') {
    console.log("This is the Random condition");
}
else {
    console.log('');
    console.log('=================== Application Error ====================');
    displayError();
}
