require("dotenv").config();

var dotenv = require('dotenv');
var keys = require('./keys.js');
var request = require('request');
var spotify = require('node-spotify-api');
var twitter = require('twitter');

var command = process.argv[2];
var parameter = process.argv[3];

var spotifyApp = new spotify(keys.spotify);
var twitterApp = new twitter(keys.twitter);


console.log("Node successfully processed liri.js");
