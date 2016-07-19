var mongoose = require('mongoose');
var MessageSchema = require('../models/chat-message');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Message = mongoose.model('Message', MessageSchema);


var chat = new Schema({
			createdBy: String,//senderId
			receiver: String,
			messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],			
			datetime: {type: Date, default: Date.now},			
			isBlocked:{type: Number, default: 0},
		});


 module.exports = mongoose.model('Chat', chat);  