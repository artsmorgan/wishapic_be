var mongoose = require('mongoose');
var model = {};
//static method
model.schema = function(){
	return mongoose.Schema({			
			userId:String, 		//room ID
			followingId:String, //Who initiates the chat
			isAproved:String, 	//Who initiates the chat
			dateCreated:String, //Who gets the chat	
			dateAproved:String, //Who initiates the chat		
		});
}

model.friendScheme =  mongoose.model('Friends', model.schema);

model.add = function(friendObj){
	return;
}

model.remove = function(friendId){
	return;
}

// exports.isFriend = function(userId, friendId){
// 	//use schema = model.friendScheme
// 	var Friend = model.friendScheme;

// 	Friend.find({
// 	      $and: [
// 	          { $or: [{followerId: userId}, {followingId: friendId}] }
// 	      ]
// 	  }, function (err, results) {
// 		return true;  	
// 	  }
	
// }

//exports static method
exports.schema = model.scheme();
exports.create = model.create(friendObj);