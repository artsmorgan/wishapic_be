var userController = {};
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var userModel = require('../models/user').schema();
var User = mongoose.model('User', userModel);
var nodemailer = require('nodemailer');
var emailUtils = require('../utils/email');
var moment = require('moment');

var error = {};
	error.usernameIncorrect = 'username or password incorrect';
	error.notActive = 'Username not active';
	error.userNotFound = 'User not found';
	error.invalidHash = 'Invalid Link';


//Private methods
userController.encriptPassword = function(password){
	return  bcrypt.hashSync(password);
}

userController.createLoginHash = function(){
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
	return  bcrypt.hashSync(text);
}

userController._isUserOnline = function(userId){
	
	User.findOne({ '_id': userId },  function (err, userdata) {
		var loginDate = new Date(userdata.lastLogin);
		var login = moment(loginDate);
		var last2Minutes = moment(loginDate).add(2, 'minutes');
		var now = moment();

		return now.isSameOrBefore(last2Minutes);
	});
}

//Public methods
exports.create = function(req, res){
	// console.log(req.body);
	// return false;
	var passwordHashed = userController.encriptPassword(req.body.password);

	User.findOne({ 'email': req.body.email },  function (err, userdata) {
	  if (err) return handleError(err);
	  if(userdata){
	  	res.json({error:'email is already in use'});
	  }else{
	  		var hash = userController.createLoginHash();
			var user = new User();			
				user.username = req.body.user;
				user.email = req.body.email;
				user.age = req.body.age;
				user.country = req.body.country;
				user.password = passwordHashed;
				user.lastIpLogin = req.connection.remoteAddress;
				user.registeredDate = Date.now();	
				user.hashLogin = hash;			
				user.save(function(err, user_Saved){
				    if(err){
				        throw err;
				        console.log(err);
				    }else{
				    	//send email				    
				    	var hash64 = new Buffer(user_Saved.hashLogin).toString('base64');
				    	var id64 = new Buffer(user_Saved.id).toString('base64');	
				    	var hashToBase64 = hash64+'$'+id64;
				    	emailUtils.sendActivationLink(user_Saved.email,hashToBase64);
				        res.json({
				        	id: user_Saved.id,
				        	username : user_Saved.username,
				        	email : user_Saved.email
				        })
				    }
				});    
	  }
	  
	})
	
}
exports.activate = function(req, res){
	//TODO Split activate link and id
	var SplitStr = req.query.activate.split('$');
	var id = SplitStr[1];
	var hash = SplitStr[0];
	var hashToString = new Buffer(hash, 'base64').toString('ascii');
	var idToString = new Buffer(id, 'base64').toString('ascii');

	User.findOne({ '_id': idToString },  function (err, userdata) {
		//res.send('hashToString: ' + hashToString + ' | idToString: ' + idToString);
		if(userdata==null){
			res.json({error:error.userNotFound});		
		}else{
			// console.log('hashToString',hashToString);
			// console.log('userdata.hashLogin',userdata.hashLogin);
			if(hashToString == userdata.hashLogin){
				userdata.isBlocked = 1;
				userdata.activeDate = Date.now();
				userdata.save(function(err, user_Saved){
					res.send('You are now active, please go back and login in Wishapic');	
				});
				
			}else{
				res.json({error:error.invalidHash});	
			}
		}
	});

	
}

exports.login = function(req, res){	
	console.log('req.body.email', req.body)
	User.findOne({ 'email': req.body.email },  function (err, userdata) {
		if (err) return handleError(err);
		if(userdata){			
			//Check password			
			if(userdata.isBlocked == 0){
				res.json({error:error.notActive});
			}else{
				console.log('req.body: ' +req.body.password + ' / ' + userdata.password)
				if(bcrypt.compareSync(req.body.password, userdata.password)){
					userdata.hashLogin = userController.createLoginHash();
					userdata.lastLogin = new Date();
					userdata.save(function(err,logged) {
		                if (err)
		                    res.send(err);

		                res.json({
				        	username : logged.username,
				        	email : logged.email,
				        	hash : logged.hashLogin,
				        	lastLogin: logged.lastLogin
				        })
		            });
				} else{
					res.json({error:error.usernameIncorrect});
				}
			}
			
		}else{
			res.json({error:error.usernameIncorrect});
		}
	});
}



exports.isUserOnline = function(req, res){
	var userId = '577fd9ce4a60bf9a136629df';
	res.json({ "isUSerLogin" : userController._isUserOnline(userId)||null });	
}


















