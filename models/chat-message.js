var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var message = new Schema({
			userTo: String,
			userFrom: String,
			message: String,
			media: String,
			datetime: String,
			roomId: String,
			readUnreadFlg:Number,
			visiblefor: Number
		});

module.exports = mongoose.model('Message', message);  