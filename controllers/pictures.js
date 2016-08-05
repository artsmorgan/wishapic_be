var picturesController = {};
var bcrypt 		= require('bcrypt-nodejs');
var mongoose 	= require('mongoose');
var pictureModel = require('../models/pictures').schema();
var Picture = mongoose.model('Picture', pictureModel);
var moment 		= require('moment');
var error = {};

picturesController.hasWhiteSpace = function(s) {
  return /\s/g.test(s);
}

picturesController.parseTags = function(tags){
	var res = '';
	if(picturesController.hasWhiteSpace(tags)){
		 res = tags.split(" ");	
	}else{
		res = tags;
	}
	
	return res;
}

picturesController.getEndpublishDate = function(timmer){
	var now = moment();	
	var endsAt = now.add(timmer, 's');
	return endsAt;
}

exports.create = function(req,res){
	// console.log(req);
	var now = moment();
	var picture = new Picture();	
		picture.userId 			= req.body.userId; 
		picture.tags 			= picturesController.parseTags(req.body.tags);
		picture.description 	= req.body.tagsDesc;
		picture.location		= req.body.location;
		picture.timmer			= req.body.timmer;
		picture.dateCreated 	= now;
		picture.dateEndPublish  = picturesController.getEndpublishDate(req.body.timmer);
		picture.url				= req.body.picDate;
		picture.save(function(err, picture_saved){
		    if(err){
		        throw err;				        
		    }else{
		    	res.json(picture_saved);
		    }
		});				    

}

exports.getPictureById = function(req,res){

}

exports.getPictureByHappeningNow = function(req,res){

}

exports.getPictureHappeningNowByUser = function(req,res){
	
}

exports.getPictureByUser = function(req,res){
	
}

















