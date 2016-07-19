var chatController = {};
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Chat = require('../models/chat');
var Message = require('../models/chat-message');
// var Chat = mongoose.model('Chat', chatModel);
// var Message = mongoose.model('Message', messageModel);
var error = {};

chatController._postMessage = function(req,cb){
	var chatId = req.body.roomId;
	
	// console.log(chatId);
	var message = new Message();
		message.userTo = req.body.sender;
		message.userFrom = req.body.receiver;
		message.msj = req.body.message || null;
		message.media = req.body.media || null;
		message.roomId = chatId;
		message.readUnreadFlg = 0;
		message.save(function(err,messageObj) {
	        if (err)
	            res.send(err);

	    	Chat.findOne({ '_id': chatId },  function (err, chat) {
	    		
	    		var messages = chat.messages;    		
	    		var newMessages = messages.push(messageObj.id);	    		   			    		
	    		chat.messages = messages;	    		
	    		chat.save(function(err,chatObj) {	    			
	    			cb(chatObj);
	    		});
        	});	        
	    });

	 
}

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
          	{ $or: [{createdBy: req.body.userId}, {receiver: req.body.userId }] }
	      ]
	  }, function (err, chats) {
	      res.json(chats);
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
	chatController._postMessage(req,function(chats){
		res.json({ "chats":  chats });	
	})
	
}

exports.getChatById = function(req,res){
	//Chat Belongs to user
	User.findOne({ '_id': req.body.userId },  function (err, userdata) {
		Chat.findOne({ '_id': req.body.chatId },  function (err, chat) {	    		
			res.json(chat);
		});	
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















