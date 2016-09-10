var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.schema = function(req, res){
	return new Schema({		
			wishedId: String,
			status: String, // ['pending', 'completed', 'rejected']			
			timmer: Number,
			createdAt: Date
		});
}