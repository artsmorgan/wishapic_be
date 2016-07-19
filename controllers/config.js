var configController = {};
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
// var chatModel = require('../models/chat').schema();
// var Chat = mongoose.model('Chat', chatModel);

var error = {};

exports.main = function(req,res){
	return {
		config: [
			{
		        "id": 1,
		        "bg": "../../img/test1.jpg"
		    },
		    {
		        "id": 2,
		        "bg": "../../img/test1.jpg"
	    	}
	    ]
	}
}

exports.remove = function(req,res){

}

exports.removeFollower = function(req,res){

}

exports.getFollowersByUser = function(req,res){
	
}

exports.getFollowingByUser = function(req,res){
	
}

















