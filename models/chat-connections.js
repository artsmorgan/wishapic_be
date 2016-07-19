var mongoose = require('mongoose');
exports.schema = function(req, res){
	return mongoose.Schema({			
			senderId:String, //Who initiates the chat
			receiverId:String, //Who gets the chat			
		});
}