var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.schema = function(req, res){
	return new Schema({			
			userId: String,
			pictureId: String,
			status: String, // ['active', 'granted', 'rejected']
			requestedBy: String, // Requested user id
			createdAt: Date
		});
}