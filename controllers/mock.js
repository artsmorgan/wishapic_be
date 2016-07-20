var mockController = {};
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
// var chatModel = require('../models/chat').schema();
// var Chat = mongoose.model('Chat', chatModel);

var error = {};

exports.happeningNow = function(req,res){
	res.json([{
        "id": 1,
        "posts": [{
            "username": "Ammanda Roberts",
            "urlPicture": "img/Testprofile.jpg",
            "profilePicture": "img/profile.jpg",
            "description": "Lorem ipsum dolor sit amet, has purto dolore noster eu.",
            "location": "san jose",
            "duration": 2500,
            "timestamp": "12/12/12 08:06",
            "tags": ["test", "hey!", "OMG"]
        }, {
            "username": "Ammanda Roberts",
            "urlPicture": "img/Testprofile.jpg",
            "profilePicture": "img/profile.jpg",
            "description": "Lorem ipsum dolor sit amet, has purto dolore noster eu.",
            "location": "san jose",
            "duration": 2500,
            "timestamp": "12/12/12 08:06",
            "tags": ["test", "hey!", "OMG"]
        }, {
            "username": "Ammanda Roberts",
            "urlPicture": "img/Testprofile.jpg",
            "profilePicture": "img/profile.jpg",
            "description": "Lorem ipsum dolor sit amet, has purto dolore noster eu.",
            "location": "san jose",
            "duration": 2500,
            "timestamp": "12/12/12 08:06",
            "tags": ["test", "hey!", "OMG"]
        }],
        "notifications": {
            "chat": 1,
            "wished": 3,
            "granted": 4,
            "camera": 1
        }
    }])
}

exports.picturesGranted = function(req,res){
	res.json([{
        "id": 1,
        "user": {
            "username": "Ammanda Roberts",
            "profilePicture": "img/profile.jpg",
            "location": "san jose"
        },
        "post": {
            "urlPicture": "img/Testprofile.jpg",
            "description": "Lorem ipsum dolor sit amet, has purto dolore noster eu.",
            "tags": ["test", "hey!", "OMG"]
        },
        "pictures": [{
            "urlPicture": "img/Testprofile.jpg",
            "duration": 20,
            "grantedTo": {
                "username": "Alfred Bachell",
                "profilePicture": "img/profile3.jpg",
                "location": "Spain"
            }
        }, {
            "urlPicture": "img/cat.jpg",
            "duration": 3,
            "grantedTo": {
                "username": "Rocio Gonzalez",
                "profilePicture": "img/profile2.jpg",
                "location": "Colombia"
            }
        }, {
            "urlPicture": "img/beach.jpeg",
            "duration": 15,
            "grantedTo": {
                "username": "Maria Rivera",
                "profilePicture": "img/profile4.jpg",
                "location": "Chile"
            }
        }]
    }]);
}

exports.wished = function(req,res){
	res.json([{
        "id": 1,
        "wishers": [{
            "wishedId": 2,
            "timestamp": "12:12:12",
            "wishedPicture": "img/profile.jpg",
            "wishedName": "Emilia Clarke",
            "wishedLocation": "Chicago, USA"
        }, {
            "wishedId": 3,
            "timestamp": "12:12:12",
            "wishedPicture": "img/profile.jpg",
            "wishedName": "Emilia Clarke",
            "wishedLocation": "Chicago, USA"
        }, {
            "wishedId": 4,
            "timestamp": "12:12:12",
            "wishedPicture": "img/profile.jpg",
            "wishedName": "Emilia Clarke",
            "wishedLocation": "Chicago, USA"
        }]
    }])
}

exports.granted = function(req,res){
	res.json([{
        "id": 1,
        "granteds": [{
            "grantedId": 2,
            "timestamp": "12:12:12",
            "grantedPicture": "img/profile.jpg",
            "grantedName": "Emilia Clarke",
            "grantedLocation": "Chicago, USA"
        }, {
            "grantedId": 3,
            "timestamp": "12:12:12",
            "grantedPicture": "img/profile.jpg",
            "grantedName": "Emilia Clarke",
            "grantedLocation": "Chicago, USA"
        }, {
            "grantedId": 4,
            "timestamp": "12:12:12",
            "grantedPicture": "img/profile.jpg",
            "grantedName": "Emilia Clarke",
            "grantedLocation": "Chicago, USA"
        }]
    }])
}


exports.locations = function(req,res){
	res.json([{
        "totalCountries": 3,
        "totalCities": 10,
        "countries_cities": [{
            "id": 1,
            "name": "Costa Rica",
            "urlPicture": "img/costa_rica.jpg"
        }, {
            "id": 2,
            "name": "Paris",
            "urlPicture": "img/eifel_tower.jpg"
        }, {
            "id": 3,
            "name": "Brazil",
            "urlPicture": "img/brazil.jpg"
        }, {
            "id": 4,
            "name": "Dubai",
            "urlPicture": "img/dubai.jpg"
        }]
    }])
}

exports.tags = function(req,res){
	res.json([
        "test",
        "hey",
        "world",
        "fun",
        "wow",
        "noone",
        "this is",
        "prueba",
        "other test",
        "qt"
    ]);
}

exports.followPerson = function(req,res){
	res.json([{
        "id": 1,
        "userInfo": {
            "username": "Ammanda Roberts",
            "profilePicture": "img/profile.jpg",
            "picturesCount": 20,
            "followingCount": 50,
            "followersCount": 250,
            "descriptions": [
                "Universal",
                "Entrepreneur",
                "Investing in life",
                "Southern California"
            ]
        }
    }]);
}

exports.following = function(req,res){
	res.json([{
        "id": 1,
        "users": [{
            "id": 2,
            "username": "Ammanda Roberts",
            "location": "Colombia",
            "profilePicture": "img/profile.jpg"
        }, {
            "id": 3,
            "username": "Adriana",
            "location": "San Jose",
            "profilePicture": "img/profile2.jpg"
        }, {
            "id": 4,
            "username": "Adrian Rivas",
            "location": "Chile",
            "profilePicture": "img/profile3.jpg"
        }, {
            "id": 5,
            "username": "Brooks",
            "location": "California, USA",
            "profilePicture": "img/profile3.jpg"
        }, {
            "id": 6,
            "username": "Daniela",
            "location": "Brazil",
            "profilePicture": "img/profile4.jpg"
        }, {
            "id": 7,
            "username": "Jessica Smith",
            "location": "Canada",
            "profilePicture": "img/profile.jpg"
        }]
    }]);
}

exports.followers = function(req,res){
	res.json([{
        "id": 1,
        "users": [ {
            "id": 3,
            "username": "Adriana",
            "location": "San Jose",
            "profilePicture": "img/profile2.jpg"
        }, {
            "id": 4,
            "username": "Adrian Rivas",
            "location": "Chile",
            "profilePicture": "img/profile3.jpg"
        }, {
            "id": 5,
            "username": "Brooks",
            "location": "California, USA",
            "profilePicture": "img/profile3.jpg"
        }, {
            "id": 6,
            "username": "Bianca",
            "location": "Brazil",
            "profilePicture": "img/profile4.jpg"
        }, {
            "id": 7,
            "username": "Jessica Smith",
            "location": "Canada",
            "profilePicture": "img/profile.jpg"
        }]
    }]);
}

















