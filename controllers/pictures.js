var picturesController = {};
var bcrypt 		= require('bcrypt-nodejs');
var mongoose 	= require('mongoose');
var async = require('async');


var pictureModel = require('../models/pictures').schema();
var Picture = mongoose.model('Picture', pictureModel);

var userModel = require('../models/user').schema();
// var User = mongoose.model('User', userModel);
var User;

if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', userModel);
}

	
var moment 		= require('moment');
var error = {};


picturesController.now = function(){
	return Date.now();	
}	

picturesController.hasWhiteSpace = function(s) {
	str = s.replace(",", "");
  return /\s/g.test(str);
}

picturesController.parseTags = function(tags){
	var res = '';
	if(picturesController.hasWhiteSpace(tags)){
		 res = tags.split(" ");	
	}else{
		res = [tags];
	}	
	return res;
}

picturesController.parseDates = function(timmer,isCreatedDate){
	// var now = moment();	
	// var endsAt = moment(now).add(timmer, 's');
	// return endsAt;
	// var t = new Date();
	// if(isCreatedDate){
	// 	timmer = 0;
	// }
	// var finalDate = t.setSeconds(t.getSeconds() + timmer);
	// return finalDate;
	// Date.now().setSeconds(picturesController.now.getSeconds() + timmer);
	var now = moment();	
	var endsAt = moment(now).add(timmer, 's');
	return endsAt;
}

exports.create = function(req,res){
	// console.log(req);
	// var now = moment();
	var picture = new Picture();	
		picture.userId 			= req.body.userId; 
		picture.tags 			= picturesController.parseTags(req.body.tags);
		picture.description 	= req.body.tagsDesc;
		picture.location		= req.body.location;
		picture.timmer			= req.body.timmer;
		picture.dateCreated 	= picturesController.parseDates(0,true);
		picture.dateEndPublish  = picturesController.parseDates(req.body.timmer,false);
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
	var id = req.params.id;
	Picture.findOne({"_id": id}, function (err, docs) {
		var pic = docs;
		console.log('docs.userId',docs.userId);
		User.findOne({"_id":docs.userId},function(err, docs){
			var user = {
				username: docs.username || null,
				email: docs.email,
				avatar: docs.avatar || null
			}
			res.json({
				'user': user,
	    		'docs':pic
	    	});	
		});
		
	});
}

exports.getHappeningNow = function(req,res){
	var now = moment();	
	
	Picture.find({"dateEndPublish": { $gt: now }}, function (err, docs) {

		var calls = [];
		var rst = [];
		var format = docs.map(function(element){
			var obj = {};			
			
			calls.push(function(callback) {
				User.findOne({"_id":element['userId']},function(err, docs){
			        var avatar = docs.avatar || '/images/nobody_m.original.jpg';
			        var avatarUrl = req.protocol + '://' + req.get('host') +avatar;
			        var tags = picturesController.parseTags(element['tags']);
			        console.log('tags',tags);
					obj['urlPicture'] = element['urlPicture'];
					obj['url'] = element['url'];
					obj['dateEndPublish'] = element['dateEndPublish'];
					obj['dateCreated'] = element['dateCreated'];
					obj['timmer'] = element['timmer'];
					obj['location'] = element['location'];
					obj['description'] = element['description'];
					obj['tags'] = tags;
					obj['userId'] = element['userId'];
					obj['avatar'] = avatarUrl;
					obj['username'] = docs.username || docs.email;
					rst.push(obj);
					callback(null, element);
					
	    		})
				
			});			
		})

		async.parallel(calls, function(err, result) {
		    /* this code will run after all calls finished the job or
		       when any of the calls passes an error */
		    if (err)
		        return console.log(err);
		    // console.log('now',now);
		    // console.log('docs',rst);
		    res.json({
	    		'now':now,
	    		'docs':rst
	    	});	
		});
	
	});
	// res.json('docs');
}

exports.testGetEndpublishDate = function(req, res){
	var now = moment();	
	var endsAt = moment(now).add(360, 's');
	res.json({
		now: now,
		timer: endsAt
	});
	// res.json('docs');
	// var now = moment();	
	// Picture.find({ "dateEndPublish": { $gt: now }}, function (err, docs) {
	//    if(err){
	//         throw err;				        
	//     }else{
	//     	res.json(docs);
	//     }
	// });

}

exports.getPictureByHappeningNow = function(req,res){
	res.json('docs');
}

exports.getPictureHappeningNowByUser = function(req,res){
	
}

exports.getPictureByUser = function(req,res){
	
}

















