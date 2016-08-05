var mongoose = require('mongoose');
var model = {};
//static method
exports.schema = function(req, res){
	return mongoose.Schema({			
			userId:String, 		//room ID
			tags:String, //Who initiates the chat
			description:String, 	//Who initiates the chat
			location:String, 	//Who initiates the chat
			location:String, 	//Who initiates the chat
			timmer:String, 	//Who initiates the chat
			dateCreated:String, //Who gets the chat	
			dateEndPublish:String, //Who initiates the chat		
			url:String, //Who initiates the chat		
			isFixed:Boolean, //Who initiates the chat		
			views:Number 	//Who initiates the chat
		});
}
