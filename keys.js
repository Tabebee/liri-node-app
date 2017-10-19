// console.log('this is loaded');
console.log("===================================================================");
var twitterKeys = {
    //  twitter Keys
    consumer_key: '5t6XsJppRXu11freBDMH2YuYd',
    consumer_secret: 'uG4RWmhf4A0GEZydZxbDBMm3wm4pz7mRCNAkjx4ld0r9QEexiI',
    access_token_key: '1649067282-q8QNYM5CUf5kJb1s0RwDQkCdczHJzCzfOBjO8Nk',
    access_token_secret: 'NPIgEDxJ7HR2U05W2ylkUdqqZPEcpogwu5X8BJ6CqnGF0'
};

var spotifyKeys = {
    client_id: '0cc0eb1c849b44deb308649ce73e12cc',
    client_secret: 'c123088cfbf74039aa5786afc5aac0e5'
};

var omdbKey = {
    API_key: '40e9cece'
};
//  since we can only export one variable, lets make another var to give it access to other variables
var allKeys = {
    twitter: twitterKeys,
    spotify: spotifyKeys,
    omdb: omdbKey
};

module.exports = allKeys;