var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.schema = function(req, res){
	return new Schema({			
			username: String,
			nickname: String,
			email: String,
			password: String,
			name: String,
			lastname:String,
			second_lastname: String,
			country:String,
			lastHappeningNow:Number,			
			isBlocked:{type: Number, default: 0},
			lastLogin:String,
			lastIpLogin:String,
			hashLogin: String,
			registeredDate: String,
			activeDate: String,
			dob: String,
			gender: String,
			age: Number,
			profilePicture: String,
			avatar: String,
		});
}