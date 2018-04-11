// A Node.js app called LIRI, like SIRI but without voice activation\commands
// by Luis Morel
// Class of 'RUTSOM201802FSF5-FT-Class'

require('dotenv').config();

var dotenv = require('dotenv');
var file = require('fs');
var keys = require('./keys.js');
var request = require('request');
var spotify = require('node-spotify-api');
var twitter = require('twitter');

var command = process.argv[2];
var parameter = process.argv[3];

var spotifyApp = new spotify(keys.spotify);
var twitterApp = new twitter(keys.twitter);

// Function to output data to log file
function logFileOutput(dataToLog) {

    file.appendFile("./log.txt", dataToLog, function (err) {

        if (err) {
            console.log(err);
        }

    });

}

// Function to display and log error message
function displayError() {

    // Capture bash terminal command and arguments (minus node and js file path) in array
    var commandLine = [];
    for (let i = 2; i < process.argv.length; i++) {
        commandLine.push(process.argv[i]);
    }

    // Display application error message in bash terminal and output to log file
    console.log('\n=================== LIRI Application Error ====================\n' +
        '\nOops, something went wrong. Please check your spelling and try again.\n' +
        '\n===============================================================');
    logFileOutput('\r\nBash Terminal Command: $ ' + commandLine.join(' ') +
        '\r\n\r\n=================== LIRI Application Error ====================\r\n' +
        '\r\nOops, something went wrong. Please check your spelling and try again.\r\n' +
        '\r\n===============================================================\r\n');

};

// Function to retrieve, display, and log movie info
function fetchMovie(movieName) {

    var queryURL = 'http://www.omdbapi.com/?apikey=trilogy&plot=short&t=' + movieName;

    request(queryURL, function (error, response, body) {

        var status = JSON.parse(body).Response;

        if (!error && status == 'True' && response.statusCode == 200) {
            var movieInfo = JSON.parse(body);
            // Retrieve Rotten Tomatoes rating; set to 'unavailable' if not provided
            var rottenTomatoesRating;
            for (let i = 0; i < movieInfo.Ratings.length; i++) {
                if (movieInfo.Ratings[i].Source == 'Rotten Tomatoes') {
                    rottenTomatoesRating = movieInfo.Ratings[i].Value;
                }
            }
            if (rottenTomatoesRating === undefined) {
                rottenTomatoesRating = 'Unavailable';
            }
            // Display movie info in bash terminal and output to log file
            console.log('\n======================= Movie Info =======================\n\nTitle: ' +
                movieInfo.Title + '\nReleased: ' + movieInfo.Year + '\nIMDB Rating: ' +
                movieInfo.imdbRating + '\nRotten Tomatoes Rating: ' + rottenTomatoesRating + '\nCountries: ' +
                movieInfo.Country + '\nLanguages: ' + movieInfo.Language + '\nPlot: ' + movieInfo.Plot +
                '\nActors: ' + movieInfo.Actors + '\n\n=================== End of Movie Info ====================');
            logFileOutput('\r\n\r\n======================= Movie Info =======================\r\n\r\nTitle: ' +
                movieInfo.Title + '\r\nReleased: ' + movieInfo.Year + '\r\nIMDB Rating: ' +
                movieInfo.imdbRating + '\r\nRotten Tomatoes Rating: ' + rottenTomatoesRating + '\r\nCountries: ' +
                movieInfo.Country + '\r\nLanguages: ' + movieInfo.Language + '\r\nPlot: ' + movieInfo.Plot +
                '\r\nActors: ' + movieInfo.Actors + '\r\n\r\n=================== End of Movie Info ====================\r\n');
        }
        else {
            // Display OMDB error in bash terminal and output to log file
            console.log('\n=================== OMDB Error ====================\n' +
                '\nSorry, unable to locate any movie titled: ' + movieName + '\n' +
                '\n=============== End of OMDB Error =================\n');
            logFileOutput('\r\n\r\n=================== OMDB Error ====================\r\n\r\n' +
                'Sorry, unable to locate any movie titled: ' + movieName +
                '\r\n\r\n=============== End of OMDB Error =================\r\n');
        }

    });

};

// Function to retrieve, display, and log song info
function fetchTracks(trackName) {

    var spotifyTrackURL = 'https://open.spotify.com/track/';

    // Default track
    if (trackName === 'The Sign') {
        spotifyApp.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE').then(function (data) {
            // Loop through artists object and store artists in array
            var artistNames = [];
            for (let i = 0; i < data.artists.length; i++) {
                artistNames.push(data.artists[i].name);
            }
            // Display song info in bash terminal and output to log file
            console.log('\n========================= Spotify =========================\n\nSong Name: ' +
                data.name + '\nArtists: ' + artistNames.join(', ') + '\nAlbum: ' + data.album.name +
                '\nSpotify Preview Link: ' + data.preview_url + '\nSpotify Link: ' + spotifyTrackURL + data.id +
                '\n\n===================== End of Spotify ======================');
            logFileOutput('\r\n========================= Spotify =========================\r\n\r\nSong Name: ' +
                data.name + '\r\nArtists: ' + artistNames.join(', ') + '\r\nAlbum: ' + data.album.name +
                '\r\nSpotify Preview Link: ' + data.preview_url + '\r\nSpotify Link: ' + spotifyTrackURL + data.id +
                '\r\n\r\n===================== End of Spotify ======================\r\n');
        })
            .catch(function (err) {
                // Display Spotify error in bash terminal and output to log file
                console.log('\n=================== Spotify Error ====================\n' +
                    err + '\n=============== End of Spotify Error =================\n');
                logFileOutput('\r\n=================== Spotify Error ====================\r\n\r\n' +
                    err + '\r\n\r\n=============== End of Spotify Error =================\r\n');
            });
    }
    else {
        spotifyApp.search({ type: 'track', query: trackName }, function (err, data) {
            if (err) {
                // Display Spotify error in bash terminal and output to log file
                console.log('\n=================== Spotify Error ====================\n' +
                    err + '\n================ End of Spotify Error ================\n');
                logFileOutput('\r\n=================== Spotify Error ====================\r\n\r\n' +
                    err + '\r\n\r\n=============== End of Spotify Error =================\r\n');
            }
            else {
                // Display Spotify header and output to log file
                console.log('\n========================= Spotify =========================\n');
                logFileOutput('\r\n========================= Spotify =========================\r\n');

                // Loops through track results and display and log relevant songs - display error otherwise
                if (data.tracks.total > 0) {
                    for (let i = 0; i < data.tracks.items.length; i++) {
                        if (data.tracks.items[i].name = trackName) {
                            var artistNames = [];
                            for (let i2 = 0; i2 < data.tracks.items[i].artists.length; i2++) {
                                artistNames.push(data.tracks.items[i].artists[i2].name);
                            };
                            // Display and log song info
                            console.log('Song Name: ' + data.tracks.items[i].name + '\nArtists: ' + artistNames.join(', ') +
                                '\nAlbum: ' + data.tracks.items[i].album.name + '\nSpotify Preview Link: ' +
                                data.tracks.items[i].preview_url + '\nSpotify Link: ' + spotifyTrackURL + data.tracks.items[i].id + '\n');
                            logFileOutput('\r\nSong Name: ' + data.tracks.items[i].name + '\r\nArtists: ' + artistNames.join(', ') +
                                '\r\nAlbum: ' + data.tracks.items[i].album.name + '\r\nSpotify Preview Link: ' +
                                data.tracks.items[i].preview_url + '\r\nSpotify Link: ' + spotifyTrackURL + data.tracks.items[i].id + '\r\n');
                        };
                    };
                }
                else {
                    // Display and log error when no tracks are available
                    console.log('Sorry, unable to locate any tracks for: ' + trackName + '\n');
                    logFileOutput('\r\nSorry, unable to locate any tracks for: ' + trackName + '\r\n');
                }
                // Display and log Spotify footer
                console.log('===================== End of Spotify ======================\n');
                logFileOutput('\r\n===================== End of Spotify ======================\r\n');
            }
        });
    };

};

// Function to process random.txt file
function processFile() {

    file.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            // Display file system error in bash terminal and output to log file
            console.log('\n=================== File System Error ====================\n' +
                error + '\n=============== End of File System Error =================\n');
            logFileOutput('\r\n=================== File System Error ====================\r\n\r\n' +
                error + '\r\n\r\n=============== End of File System Error =================\r\n');
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
                // Call function to display and log LIRI application error
                displayError();
            }
        };
    });

};

// Process LIRI Commands
if (command === 'movie-this') {
    if (parameter === undefined) {
        logFileOutput('\r\nBash Terminal Command: $ node liri.js movie-this');
        fetchMovie('Mr-Nobody');
    }
    else {
        logFileOutput('\r\nBash Terminal Command: $ node liri.js movie-this \'' + parameter + '\'');
        fetchMovie(parameter.replace(/\s+/g, '-')); // replacing white spaces with hyphens
    }
}
else if (command === 'my-tweets') {
    // Display Twitter header in bash terminal and output to log file
    console.log('\n======================== Twitter =========================');
    logFileOutput('\r\nBash Terminal Command: $ node liri.js my-tweets\r\n' +
        '\r\n======================== Twitter =========================\r\n');

    twitterApp.get('statuses/user_timeline', { q: 'nodejs', count: 20 }, function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length && i < 20; i++) {
                // Display tweets in bash terminal and output to log file
                console.log('\n' + (i + 1) + ') Tweet: ' + tweets[i].text + '\nDate/time: ' + tweets[i].created_at);
                logFileOutput('\r\n' + (i + 1) + ') Tweet: ' + tweets[i].text + '\r\nDate/time: ' + tweets[i].created_at + '\r\n');
            }
            // Display Twitter footer in bash terminal and output to log file
            console.log('\n===================== End of Twitter =====================');
            logFileOutput('\r\n===================== End of Twitter =====================\r\n');
        }
        else {
            // Display Twitter error in bash terminal and output to log file
            console.log('\n=================== Twitter Error ====================\n' +
                error + '\n=============== End of Twitter Error =================\n');
            logFileOutput('\r\n=================== Twitter Error ====================\r\n\r\n' +
                error + '\r\n\r\n=============== End of Twitter Error =================\r\n');
        }
    });
}
else if (command === 'spotify-this-song') {
    if (parameter === undefined) {
        // Output bash terminal arguments and retrieve, display, and log song
        logFileOutput('\r\nBash Terminal Command: $ node liri.js spotify-this-song\r\n');
        fetchTracks('The Sign');
    }
    else {
        // Output bash terminal arguments and retrieve, display, and log songs
        logFileOutput('\r\nBash Terminal Command: $ node liri.js spotify-this-song \'' + parameter + '\'\r\n');
        fetchTracks(parameter);
    }
}
else if (command === 'do-what-it-says') {
    // Display and log 'processing file' header in bash terminal and log file
    console.log('\nProcessing File...\n');
    logFileOutput('\r\nBash Terminal Command: $ node liri.js do-what-it-says\r\n' +
        '\r\nProcessing File...\r\n');
    // Read and process random.txt file
    processFile();
}
else {
    // Display and log LIRI application error
    displayError();
}
