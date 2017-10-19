//  import keys
var keys = require("./keys.js");
//  require all the packages needed here
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");
var moment = require("moment");
//  declare variables for user input and incorporate spaces as + for spotify and movie
var input = process.argv[2];
var input2 = process.argv[3];
var allInput = process.argv;
//  For Spotify and OMDB
for (var i = 4; i < allInput.length; i++) {
    input2 += "+" + allInput[i];
}
//  Declare these as global to avoid scoping issues when functions are called
var song;
var MovieTitle;
//  display this IF no commands are requested
if (!input) {
    console.log("Please choose from one of the following commands");
    console.log("node liri.js my-tweets");
    console.log("node liri.js spotify-this-'song song_name_here'");
    console.log("node liri.js movie-this 'movie_name_here'");
    console.log("node liri.js 'do-what-it-says'");
}
// console.log(keys.consumer_key);

//  Setup switch case from input
switch (input) {
    case "my-tweets":
        displayTweets();
        break;

    case "spotify-this-song":
        spotifyMe();
        break;

    case "movie-this":
        movieMe();
        break;

    case "do-what-it-says":
        doThis();
        break;
}

function displayTweets() {

    //******************Very Basic what was asked***********************************************************************
    // var param = {
    //     screen_name: 'DwyaneWade'
    // };
    // var client = new Twitter({
    //     consumer_key: keys.consumer_key,
    //     consumer_secret: keys.consumer_secret,
    //     access_token_key: keys.access_token_key,
    //     access_token_secret: keys.access_token_secret
    // });
    //
    // client.get('statuses/user_timeline', param, function (err, tweets, response) {
    //     if (!err) {
    //         for (var i=0; i < tweets.length; i++) {
    //             console.log("On " + "blank " + " @" + param.screen_name + " tweeted: " + tweets[i].text);
    //         }
    //     }
    // });

    //********************Ask User whos tweets they want to see*********************************************************
    inquirer
        .prompt([
            {
                type: "input",
                message: "Type in a twiter tag to see tweets? (ie. DwyaneWade)",
                name: "screenName",
                default: "twitter"
            }
        ])
        .then(function (inquirerResponse) {
            if (inquirerResponse) {
                //  Assign user answer to variable to use when grabbing tweets
                var param = {
                    screen_name: inquirerResponse.screenName
                };
                var client = new Twitter({
                        consumer_key: keys.twitter.consumer_key,
                        consumer_secret: keys.twitter.consumer_secret,
                        access_token_key: keys.twitter.access_token_key,
                        access_token_secret: keys.twitter.access_token_secret
                    });
                client.get('statuses/user_timeline', param, function (err, tweets, response) {
                    //  If there is no error, run a for loop to display each tweet separately and use
                    //  momentJS to convert from military time to regular
                    if (!err) {
                        console.log("Here come their tweets!");
                        for (var i = 0; i < tweets.length; i++) {
                            // console.log( JSON.stringify(response) );
                            date = moment(tweets[i].created_at).format('MMMM Do YYYY, h:mm:ss a');
                            console.log("On " + date + " @" + inquirerResponse.screenName + " tweeted: " + tweets[i].text);
                            console.log("================================================================");
                        }
                    } else if (err) {
                        console.log("Please enter a valid twitter screen name exactly" + err);
                    }
                })
            }

        })
//    ******************************************************************************************************************
}

function spotifyMe() {
    //****************** Very Basic what was asked *********************************************************************
    if (input2 === undefined) {
        song = "The Sign";
    } else {
        song = input2;
    }
    var newSpotify = new Spotify({
        id: keys.spotify.client_id,
        secret: keys.spotify.client_secret
    });
    newSpotify.search({
        type: 'track', query: song, limit: 2}, function (err, data) {
            if (err) {
                console.log("Oh Oh, spagetti O: " + err);
            }
            if (!err) {
                var dataItems = data.tracks.items;
                // console.log(JSON.stringify(dataItems , null, 2));
                console.log("Here are the top Two results from spotify");
                for (var i = 0; i < dataItems.length;i++) {
                    var preview = dataItems[i].preview_url;
                    if (preview === null) {
                        preview = "Sorry Spotify does not have a oreview URL for this song title"
                    }
                    console.log("Song Name: " + dataItems[i].name);
                    console.log("Artist: " + dataItems[i].artists[0].name);
                    console.log("Preview: " + preview);
                    console.log("Album Title: " + dataItems[i].album.name);
                    console.log("================================================================");
                }
            }
    });

//    ************************* Ask User what song to spotify **********************************************************
//     inquirer
//         .prompt([
//             {
//                 type: "input",
//                 message: "Which wong would you like to spotify?",
//                 name: "songTitle"
//             }
//         ])
//         .then(function (inquirerResponse) {
//             if (inquirerResponse) {
//                 MovieTitle = inquirerResponse.songTitle;
//             } else {
//                 MovieTitle = "The Sign"
//             }
//             var newSpotify = new Spotify({
//                 id: keys.client_id,
//                 secret: keys.client_secret
//             });
//             newSpotify.search({
//                 type: "track", query: MovieTitle}, function (err, data) {
//                     if (err) {
//                         console.log("Oh Oh, spagetti O: " + err);
//                 }
//                 console.log(data);
//             })
//         })

}
//  Movie function case
function movieMe() {
    //  Set defualt Movie search to Mr. Nobody if there are none specified
    if(!input2) {
        MovieTitle = "Mr. Nobody";
    } else {
        MovieTitle = input2;
    }
    console.log("Here's the info for the movie " + MovieTitle);
    //  Run our query thru OMDB with MovieTitle
    var queryURL = "http://www.omdbapi.com/?t=" + MovieTitle + "&y=&plot=short?&apikey=" + keys.omdb.API_key;
    request(queryURL, function(err, response, body) {
        if (err) {
            console.log("Please Kindly enter a valid movie title");
        }
        //  Assign variables for data we want t print to console
        var title = "Movie Title: " + JSON.parse(body).Title;
        var year = "Year Release: " + JSON.parse(body).Year;
        var imdbRating = "IMDB Rating: " + JSON.parse(body).Ratings[0].Value;
        var rottenTomato = "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
        var country = "Country Produced: " + JSON.parse(body).Country;
        var language = "Language: " + JSON.parse(body).Language;
        var plot = "Plot: " + JSON.parse(body).Plot;
        var actors = "Actors: " + JSON.parse(body).Actors;
        //  Connect all variable into an array to sort thru and log more efficiently
        var movieInfo = [title, year, imdbRating, rottenTomato, country, language, plot, actors];

        if (!err && response.statusCode === 200) {
            //  Use forEach to go thru array and log movie info
            movieInfo.forEach(function(variable) {
                console.log(variable);
            });
            console.log("================================================================");
            // console.log(response);
        }
    })
}

function doThis() {
    console.log("Now Reading text inside file 'random.txt'");
    //  run 'readFile' and store into varible 'data'
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            console.log("Whoops look like we ran into and error: " + err);
        }
        var text = data.split(",");
        // console.log(text);
        input = text[0];
        input2 = text[1];
        for (var i = 4; i < allInput.length; i++) {
            input2 += "+" + allInput[i];
        }
        spotifyMe();
    })
}
