var chatController = {};
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Chat = require('../models/chat');
var Message = require('../models/chat-message');
var async = require('async');

var userModel = require('../models/user').schema();
// var User = mongoose.model('User', userModel);
var User;

if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', userModel);
}

// var Chat = mongoose.model('Chat', chatModel);
// var Message = mongoose.model('Message', messageModel);
var error = {};

chatController._postMessage = function(req,cb){
	console.log('req.body',req.body);
	var message = new Message();
		message.userTo = req.body.sender;
		message.userFrom = req.body.receiver;
		message.message = req.body.message || null;
		message.media = req.body.media || null;

		message.readUnreadFlg = 0;
		message.save(function(err,messageObj) {
	        if (err)
	            cb(err);
	  
	        //prepare the haschat obj	        
	        var checkchatobj = {
	        	params: {
	        		receiver: req.body.receiver,
	        		sender: req.body.sender
	        	}
	        };

	        //has chat

	        chatController._chatExists(checkchatobj, function(chat){
	        	console.log('chat',chat);
	        	var chatID = chat.chatId;

				if(chat.count>0){
					Chat.findOne({ '_id': chatID },  function (err, chatFounded) {	 
						console.log('chatFounded',chatFounded);

						messageObj.roomId = chatID;					
						var messages = chatFounded.messages;    		
			    		var newMessages = messages.push(messageObj.id);	    		   			    		
			    		chatFounded.messages = messages;	    		
			    		chatFounded.save(function(err,chatObj) {	    			
			    			cb(chatObj);
			    		});	
					
			    		
		        	});	
				}else{

					//create new chat and append the message
					var chat = new Chat();
					chat.createdBy = req.body.sender;
					chat.receiver = req.body.receiver; //test
					chat.save(function(err,chatObj) {
				        if (err)
				            cb(err);

						var messages = chatObj.messages;    		
						var newMessages = messages.push(messageObj.id);	    		   			    		
			    		chatObj.messages = messages;	    		
			    		chatObj.save(function(err,nchatObj) {
			    			console.log('nchatObj',nchatObj);
				    		// message.roomId = chatID;
							messageObj.roomId = nchatObj.id;
							cb(nchatObj);
							// messageObj.save(err, function(nm){
							// 	console.log('nm',nm);					
							// });	    			
			    			
			    		});
				    });  
				}
			});
	    	//end has chat         
	    });

	 
}



chatController._chatExists = function(req, cb){
	var receiver = req.params.receiver;
	var creator = req.params.sender;
	// console.log('creator',creator);
	// console.log('receiver',receiver);
	Chat.find({
		$and: [
          	{ $or: [{createdBy: receiver}, {receiver: receiver }] },
          	{ $or: [{createdBy: creator}, {receiver: creator }] }
	      ]
      	// $or: [{createdBy: creator}, {receiver: receiver }]
      	// $or: [{createdBy: receiver}, {receiver: creator }]
	  }, function (err, chats) {
	  		// console.log('cl', chats.length);
	  		var c = 0;
	  		var count = 0;
	  		if(chats.length>0){
	  			c = chats[0].id;
	  			count = chats.length;
	  		}

			cb({chatId: c, count: count});
	  });
}

exports.hasChats = function(req, res){
	chatController._chatExists(req, function(chats){
		res.json(chats);	
	});
	
};

exports.init = function(io){
//Socket Stuff
	io.on('connection', function(socket){

		socket.on('room', function(room) {
	        socket.join(room);
	    });
		var room = '57844831d6d641d0e382dd9e';
	    


		socket.on('post message', function(data){
			console.log('here',data);
			//save msg
			io.sockets.in(data.roomId).emit('message', {from: data.sentBy, to: data.sentTo, msg:data.message});
		});
	});

}



//Many chats
exports.getChatsByUser = function(req,res){	
    Chat.find({
      $and: [
          	{ $or: [{createdBy: req.params.userId}, {receiver: req.params.userId }] }
	      ]
	  }, function (err, chats) {
	      res.json(chats);
	  });
}

exports.getChatsListByUser = function(req,res){	
    Chat.find({
      $and: [
          	{ $or: [{createdBy: req.params.userId}, {receiver: req.params.userId }] }
	      ]
	  }, function (err, chats) {

	  		var calls = [];
	  		var rst = [];
	  		var format = chats.map(function(element){
	  			
	  			//i'm i the creator of the chat?
	  			var lookingFor = '';	  			
	  			
	  			if(element['createdBy'] == req.params.userId){
	  				lookingFor = 'receiver';
	  			}else{
	  				lookingFor = 'createdBy';
	  			}

	  			var obj = {};
		  		calls.push(function(callback) {
		  			// console.log('eelement[lookingFor]',element[lookingFor]);
		  			// console.log('element[req.params.userId]',req.params.userId);

		  			if(element[lookingFor] != req.params.userId){

		  				User.findOne({"_id":element[lookingFor]},function(err, docs){
		  					// console.log('docs',docs['id']);
		  					var avatar = docs.avatar || '/images/nobody_m.original.jpg';
			        		var avatarUrl = req.protocol + '://' + req.get('host') +avatar;
							obj['chatID'] = element['id'];					
							obj['userId'] = docs['id'];
							obj['avatar'] = avatarUrl;
							obj['username'] = docs.username || docs.email;
							rst.push(obj);
							callback(null, element);
		  				});	
		  			}	
		  		});
		  	});	

	  		async.parallel(calls, function(err, result) {
			    /* this code will run after all calls finished the job or
			       when any of the calls passes an error */
			    if (err)
			        return console.log(err);
			    // console.log('now',now);
			    // console.log('docs',rst);
			    res.json({
		    		'docs':rst
		    	});	
			});

	      
	  });
}

exports.create = function(req,res){
	//check if the relation was created before and never used
	var receiver = req.body.receiver;
	var creator = req.body.sender;
	var chatId = null;
	
	Chat.findOne({
      $and: [
          	{ $or: [{createdBy: creator}, {receiver: creator }] },
          	{ $or: [{createdBy: receiver}, {receiver: receiver }] }
	      ]
	  }, function (err, chats) {		                
	  		if (err)
	            res.send(err);	

	        if(chats){
				res.json(chats.id);
			}else{
				var chat = new Chat();
				chat.createdBy = creator;
				chat.receiver = receiver;
				chat.save(function(err,chatObj) {
			        if (err)
			            res.send(err);

			        res.json(chatObj.id);
			    });  	
			}	      		      	
	  });
	
}

exports.messagePost = function(req, res){
	//resolve it
	console.log('test');
	chatController._postMessage(req,function(chats){
		res.json({ "chats":  chats });	
	})
	
}

exports.getChatById = function(req,res){
	//Chat Belongs to user	
	Chat.findOne({ '_id': req.params.chatId },  function (err, chat) {	    		
		// var chat = [chat];
		if(chat){
			var calls = [];
	  		var rst = [];
	  			
	  		var format = chat['messages'].map(function(element){
	  			calls.push(function(callback) {		  		
	  				var obj = {};
	  				Message.findOne({"_id":element},function(err, docs){
	  					console.log(docs);
						rst.push(docs);
						callback(null, element);
	  				});			  			
		  		});	
	  			console.log(rst);
	  		});
	  		async.parallel(calls, function(err, result) {
				res.json({
		    		'messages':rst,
		    		'chatId': req.params.chatId
		    	});	
	  		});	 
	  	}else{
	  		res.json({
		    		'messages':0,
		    		'chatId': 0
		    	});	
	  	}

	  		
	});	
	
}

exports.updateMessageById = function(req,res){
	//Chat Belongs to user	
	var messages = req.body.messages;
	// console.log(messages);
	if(!messages){

		res.json({
			'messages':0,
			'chatId': 0
		});
	}
	
	var calls = [];
	var rst = [];
	messages.map(function(element){		
		console.log('element',element.id);
		// var rst = [];
		calls.push(function(callback) {		  					
			Message.update({"_id":element.id}, {readUnreadFlg: 1}, function(err, affected, resp){
				// console.log(affected);
				// console.log(resp);
				rst.push(affected);
				callback(null, element);
			});			  			
		});	

		// console.log(rst);
	});		

	async.parallel(calls, function(err, result) {
		res.json({
			'messages':rst,
			'chatId': req.params.chatId
		});	
	});	 

	
}

exports.getNewMessage = function(req,res){
	
	//Chat Belongs to user	
	// console.log('req.params.userId',req.params.userId);
	// console.log('req.params.chatId',req.params.chatId);

	Chat.findOne({ '_id': req.params.chatId },  function (err, chat) {	    		
		// var chat = [chat];
		if(chat){
			var calls = [];
	  		var rst = [];
	  			
	  		var format = chat['messages'].map(function(element){
	  			// console.log('element',element);
	  			calls.push(function(callback) {		  		
	  				var obj = {};
	  				Message.findOne({	  									
	  									"_id": element,
	  									"readUnreadFlg": 0,
	  									"userTo": req.params.userId
	  								},
	  				function(err, docs){
	  					// console.log(docs);
	  					
	  					if(docs)
							rst.push(docs);

						callback(null, element);
	  				});			  			
		  		});	
	  			console.log(rst);
	  		});
	  		async.parallel(calls, function(err, result) {
				res.json({
		    		'messages':rst,
		    		'chatId': req.params.chatId
		    	});	
	  		});	 
	  	}else{
	  		res.json({
		    		'messages':0,
		    		'chatId': 0
		    	});	
	  	}

	  		
	});	
	
}

exports.delete = function(req,res){
	
}

exports.pushMsg = function(chatId, msg){
	
}



// io.sockets.on('connection', function(socket){
// 		socket.on('new user', function(data, callback){
// 		          console.log("this is my new user"+data)
// 		  		if (data in users){
// 		              console.log("data exist in user");
// 		  			callback(true);//
// 		  		} else{
// 		  		console.log("data doesnot exist in user");
// 		  			socket.nickname = data;

// 		  			users[socket.nickname] = socket;            
// 		              console.log("receiver we got is "+users[socket.nickname])
// 		          Chat.find().where({receiver:data}).exec(function abc(err, docs){
// 		  					if(err) throw err;
// 		  					console.log('emit here========');
// 		  					socket.emit('img received', docs);
// 		  					//socket.emit('load old msgs', docs);
// 		                  callback(true);
// 		                   console.log("emitted  data is "+docs)
// 		  					updateNicknames();
// 		  				});
// 		  		}
// 		  	});
		    
// 		    socket.on('request load old msgs', function(data, callback){
				
// 			socket.nickname = data;
// 		    console.log("ios requested for offline message  for "+data);
// 		    Chat.find().where({receiver:data}).exec(function abc(err, docs){
// 		    if(err) throw err ;
// 		       // socket.emit('load old msgs', docs);
// 		         console.log("send data to iOS "+docs)
		       
// 		    });
// 		    callback(true); 
// 			});
		    
// 		    socket.on('get oldmsg done', function(data){				
// 				Chat.remove({receiver:data.receiver}).where({imgFlag:0}).exec();
// 			});
		    
// 		    socket.on('get img done', function(data){
// 		        console.log('data==============>>>',data.length);
// 		        //delete from tbl...where({imgflg==0})0 for msgs
// 		        //remove chat only dont remove imgs.
// 		        for (var i = 0; i < data.length; i++) {
// 		            //data[i]
// 		            console.log('its i>>',data[i]._id);
// 		            console.log('its img>>',data[i].img);
// 		            //Chat.update({id:data[i].id},{isImgDownloaded:1}).exec();
// 		            var conditions = {id:data._id}, update = {isImgDownloaded:1}, options = { multi: true };
// 		            Chat.update(conditions, update, options, callback);
// 		            function callback (err, numAffected) {
// 		                        }
// 				}
// 			});
		            
		            
// 			function updateNicknames(){
// 				io.sockets.emit('usernames', Object.keys(users));
// 			}
		    
// 		    socket.on('typing', function(data, callback){
// 		        if(data.oppUser in users)
// 		        {
// 		            users[data.oppUser].emit('typing',{oppUser:data.oppUser,currentUser:data.currentUser});
// 		            console.log('typing ..... ');
// 		            }
// 		    });
		    
// 		    socket.on('stop typing', function(data, callback){
// 		        if(data.oppUser in users)
// 		        {
// 		            users[data.oppUser].emit('stop typing');
// 		            console.log('Stop typing ..... ');
// 		        }
// 		    });
		     
// 			socket.on('send message', function(data, callback){
// 		    console.log(data);
// 		    // var msg = data.message.trim();
// 		    var msg = data.trim();
// 			console.log('after trimming message is: ' + msg);
// 			if(msg.substr(0,3) === '/w '){
// 				msg = msg.substr(3);
// 				var ind = msg.indexOf(' ');
// 				if(ind !== -1){
// 					var name = msg.substring(0, ind);
// 					var msg = msg.substring(ind + 1);
// 					if(name in users){
// 	                    console.log('sending message to user!');
// 	          users[name].emit('whisper', {msg: msg, nick: socket.nickname, isType:data.isType });
// 						console.log('message sent is: ' + msg);
// 						console.log('Whisper!');
// 					} else{
// 						//insert data here
// 	                    console.log('Opposite user is offline hence storing in db');
// 						var newMsg = new Chat({msg: msg, img:null, nick: socket.nickname, receiver:name,imgFlag:0});
// 						newMsg.save(function(err){
// 							if(err) throw err;
// 							io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
// 	                        console.log('Going out 1');
// 						});
// 						//callback(false);
// 					}
// 				} else{
// 					callback('Error!  Please enter a message for your whisper.');
// 	                  console.log('Going out 2');
// 				}
// 			} else{
// 				io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
// 	              console.log('Going out 3');
// 			}
// 		    console.log('Going out 4');
// 			});
			
// 		    socket.on('user image', function(msg,callback){
// 		        console.log('on user img.....');
// 		        fs.exists(__dirname + "/" + msg.imageMetaData, function (exists) {
// 		                  if (!exists) {
// 		                          fs.mkdir(__dirname + "/" + msg.imageMetaData, function (e) {
// 		                           if (!e) {
// 		                           console.log("Created new directory without errors." + client.id);
		                               
// 		                               fs.writeFile(__dirname + "/" + msg.imageMetaData + "/" + msg.imageMetaData + ".jpg",           msg.imageData, function (err) {
// 		                     if (err) {
// 		                        console.log('Error writing file to when directory doesnt exist '+ __dirname + err);
// 		                     //throw err;
// 		                     }
// 		                     });
		                               
// 		                           } else {
// 		                           console.log("Exception while creating new directory....");
// 		                           //throw e;
// 		                           }
// 		                           });
// 		                  } else {
		                    
// 		                      fs.writeFile(__dirname + "/" + msg.imageMetaData + "/" + msg.imageMetaData + ".jpg",           msg.imageData, function (err) {
// 		                     if (err) {
// 		                        console.log('Error writing file when directory exist '+ __dirname + err);
// 		                     //throw err;
// 		                     }
// 		                     });
// 		                  }
		                
// 		                  }
		                    
		                 
		                 
		                 
// 		                 );
		        
		    
// 		        if(msg.toUserId in users){
// 		            console.log(msg.toUserId);
// 		            users[msg.toUserId].emit('user image',{image:msg.imageData, nick: socket.nickname});
		        
// 		            console.log('Whisper!');
// 		        } else{
// 		            console.log('***error--');
// 		        //callback('Error!  Enter a valid user.');
// 		        }
// 		        //io.sockets.emit('user image',msg.imageData);
// 		    });
		          
// 		    socket.on('share contact',function(data,callback){
// 		        var dtc=JSON.stringify(data.contactdetails);
// 		        console.log("contactdetails>>>>>>"+dtc);
// 		        if(data.toUserId in users)
// 		        {       
// 		           users[data.toUserId].emit('share contact',{contact:data.contactdetails, nick: socket.nickname});
// 		        }
// 		        else
// 		        {
// 		            console.log('***error--');
// 		        //callback('Error!  Enter a valid user.');
// 		        }
// 		    });  
		    
// 			socket.on('disconnect', function(data){
// 		        console.log("@@@@@@@@@@@@@@@@##################@@@@@@@@@@@@###########");
// 				if(!socket.nickname) return;
// 				delete users[socket.nickname];
// 				updateNicknames();
// 			});
// 	});















