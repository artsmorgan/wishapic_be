var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var preferences = new Schema({
			mainImg: String,//senderId
			loginImg: String,			
		});


 module.exports = mongoose.model('Preferences', preferences);  