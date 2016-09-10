var mongoose = require('mongoose');
var model = {};
//static method
exports.schema = function(req, res){
	return mongoose.Schema({			
			userId:String, 		//room ID
			pictureId:String, //Who initiates the chat
			viewOn:String, // 1=HN , 2=Wish
			dateCreated:String, //Who gets the chat	
		});
}
