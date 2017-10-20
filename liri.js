//  import keys
var keys = require("./keys.js");
//  require all the packages needed here
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");
var moment = require("moment");
var colors = require("colors");
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
    console.log("Please choose from one of the following commands".bold);
    console.log("node liri.js my-tweets".bold);
    console.log("node liri.js spotify-this-'song song_name_here'".bold);
    console.log("node liri.js movie-this 'movie_name_here'".bold);
    console.log("node liri.js 'do-what-it-says'".bold);
}
// console.log(keys.consumer_key);

//  Setup switch case from input
switch (input) {
    case "my-tweets":
        //  BONUS HERE *********************************************************************************
        fs.appendFile("log.txt", "Log Entry"+ "\n", function (err) {
            if (err) {
                console.log(err);
            }
        });
        //  Bonus End***********************************************************************************
        displayTweets();
        break;

    case "spotify-this-song":
        //  BONUS HERE *********************************************************************************
        fs.appendFile("log.txt", "Log Entry"+ "\n", function (err) {
            if (err) {
                console.log(err);
            }
        });
        //  Bonus End***********************************************************************************
        spotifyMe();
        break;

    case "movie-this":
        //  BONUS HERE *********************************************************************************
        fs.appendFile("log.txt", "Log Entry"+ "\n", function (err) {
            if (err) {
                console.log(err);
            }
        });
        //  Bonus End***********************************************************************************
        movieMe();
        break;

    case "do-what-it-says":
        //  BONUS HERE *********************************************************************************
        fs.appendFile("log.txt", "Log Entry"+ "\n", function (err) {
            if (err) {
                console.log(err);
            }
        });
        //  Bonus End***********************************************************************************
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
                            var date = moment(tweets[i].created_at).format('MMMM Do YYYY, h:mm:ss a');
                            var displayTweets = "On " + date + " @" + inquirerResponse.screenName + " tweeted: " + tweets[i].text;

                            console.log("On " + date.magenta + " @" + inquirerResponse.screenName.blue + " tweeted: " + tweets[i].text.bold);
                            console.log("================================================================");

                            //    BONUS HERE ***************************************************************************
                            //    still inside the for loop
                            fs.appendFile("log.txt", input + displayTweets + "\n", function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            fs.appendFile("log.txt", "================================================================" + "\n", function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            //  BONUS End ******************************************************************************
                        }
                            //  BONUS **********************************************************************************
                            fs.appendFile("log.txt", "Log Entry End"+ "\n", function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            // BONUS END *******************************************************************************
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
    if (!input2) {
        song = 'the sign';
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
                    //  declare variables for inforamtion needed
                    var songName = "Song Name: " + dataItems[i].name;
                    var artistName = "Artist: " + dataItems[i].artists[0].name;
                    var preview = "Preview: " + dataItems[i].preview_url;
                    var albumName = "Album Title: " + dataItems[i].album.name;
                    if (preview === null) {
                        preview = "Sorry Spotify does not have a oreview URL for this song title"
                    }
                    console.log("Song Name: ".bold + dataItems[i].name.green.bold);
                    console.log("Artist: ".bold + dataItems[i].artists[0].name.green.bold);
                    console.log("Preview: ".bold + dataItems[i].preview_url.green.bold);
                    console.log("Album Title: ".bold + dataItems[i].album.name.green.bold);
                    console.log("================================================================");

                    //        BONUS HERE *******************************************************************************
                    //    still inside the for loop
                    // fs.appendFile("log.txt", "Log Entry"+ "\n", function (err) {
                    //     if (err) {
                    //         console.log(err);
                    //     }
                    // });
                    fs.appendFile("log.txt", songName + "\n" + artistName + "\n" + preview + "\n" + albumName + "\n", function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    fs.appendFile("log.txt", "Log Entry End"+ "\n", function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    fs.appendFile("log.txt", "================================================================" + "\n", function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    //  BONUS Part End *********************************************************************************
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
        var title = "Movie Title: ".bold + JSON.parse(body).Title.blue.bold;
        var year = "Year Release: ".bold + JSON.parse(body).Year.blue.bold;
        var imdbRating = "IMDB Rating: ".bold + JSON.parse(body).Ratings[0].Value.blue.bold;
        var rottenTomato = "Rotten Tomatoes Rating: ".bold + JSON.parse(body).Ratings[1].Value.blue.bold;
        var country = "Country Produced: ".bold + JSON.parse(body).Country.blue.bold;
        var language = "Language: ".bold + JSON.parse(body).Language.blue.bold;
        var plot = "Plot: ".bold + JSON.parse(body).Plot.blue.bold;
        var actors = "Actors: ".bold + JSON.parse(body).Actors.blue.bold;
        //  Connect all variable into an array to sort thru and log more efficiently
        var movieInfo = [title, year, imdbRating, rottenTomato, country, language, plot, actors];

        if (!err && response.statusCode === 200) {
            //  Use forEach to go thru array and log movie info
            movieInfo.forEach(function(variable) {
                console.log(variable);
            });
            console.log("================================================================");
            // console.log(response);

            //        BONUS HERE *******************************************************************************
            //    still inside the for loop
            fs.appendFile("log.txt", title + "\n" + year + "\n" + imdbRating + "\n" + rottenTomato + "\n" + country + "\n"
                                           + language + "\n" + plot + "\n" + actors + "\n", function (err) {
                if (err) {
                    console.log(err);
                }
            });
            fs.appendFile("log.txt", "Log Entry End"+ "\n", function (err) {
                if (err) {
                    console.log(err);
                }
            });
            fs.appendFile("log.txt", "=======================================================" + "\n", function (err) {
                if (err) {
                    console.log(err);
                }
            });
            //  BONUS Part End *********************************************************************************

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
        //  split the variable and make it an array so we can use them individually
        var text = data.split(",");
        // console.log(text);
        input = text[0];
        input2 = text[1];
        for (var i = 4; i < allInput.length; i++) {
            input2 += "+" + allInput[i];
        }
        //  run the spotify function with inputs from above
        spotifyMe();
    })
}

