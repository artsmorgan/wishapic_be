var notificationsController = {};
var bcrypt 		= require('bcrypt-nodejs');
var mongoose 	= require('mongoose');
var wishModel = require('../models/wished').schema();
var Wish = mongoose.model('Wish', wishModel);
var grantedModel = require('../models/granted').schema();
var Granted = mongoose.model('Granted', grantedModel);
var moment 		= require('moment');
var error = {};


notificationsController.getGranted = function(id){

}

notificationsController.getWished = function(id){

}

exports.createWish = function(req,res){
	// console.log(req);
	// var now = moment();
	var wish = new Wish();	
		wish.userId = req.body.userId,
		wish.pictureId = req.body.pictureId,
		wish.status = 'Active', // ['active', 'granted', 'rejected', 'done']
		wish.requestedBy = req.body.requestedBy, // Requested user id
		wish.createdAt = moment();
		wish.save(function(err, wishObj){
		    if(err){
		        throw err;				        
		    }else{
		    	res.json(wishObj);
		    }
		});				    

}

exports.createGranted = function(req,res){
	// console.log(req);
	// var now = moment();
	var granted = new Granted();	
		granted.status = 'Pending'; // ['Pending', 'Completed', 'rejected']
		granted.wishedId = req.body.wishedId;
		granted.timmer = req.body.timmer;
		granted.createdAt = moment();	
		granted.save(function(err, grantedObj){
		    if(err){
		        throw err;				        
		    }else{
		    	//change wish status from active to granted
		    	Wish.findOne({ '_id': idToString }, function (err, wishObj) {
		    		wishObj.status = 'Granted';					
					wishObj.save(function(err, wishSaved){
						res.json({
							granted: grantedObj,
							wished: wishSaved
						})
					});
		    	});		    	
		    }
		});				    

}

exports.getNotificationsWished = function(req,res){
	var userId = req.params.userId;

	Wish.find({ userId: userId, status: "Active" },function (err, docs) {
		if (!err){ 
	        res.json({
	    		'docs':docs
	    	});	        
	   } else {throw err;}
	});

}


exports.all = function(req,res){
	var userId = req.params.userId;

	res.json( {
		notifications:{
			wished: 1,
			granted: 1,
			chat: 1
		}	
	})



}



