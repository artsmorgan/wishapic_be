var config       = require('../config/config').main()
	,user        = require('../controllers/user')
	,chat        = require('../controllers/chat')
	,preferences = require('../controllers/preferences')
	,friends     = require('../controllers/friends')
	,appPreferences     = require('../controllers/config');


exports.init = function(app){
	
	var API_PREFIX = config.apiPrefix;	

	//API CALLS
	app.post(API_PREFIX+'/login',user.login);

	app.get(API_PREFIX+'/activate',user.activate);
	app.post(API_PREFIX+'/user/create',user.create);
	app.get(API_PREFIX+'/userOnline',user.isUserOnline);
	//Chat
	app.post(API_PREFIX+'/chat',chat.getChatsByUser);
	app.post(API_PREFIX+'/chat/message',chat.messagePost);
	app.post(API_PREFIX+'/chat/create',chat.create);
	app.get(API_PREFIX+'/chat/id',chat.getChatById);
	//Follow User
	app.get(API_PREFIX+'/user/:id/followers',friends.getFollowersByUser);
	app.get(API_PREFIX+'/user/:id/following',friends.getFollowingByUser);
	app.post(API_PREFIX+'/followers/add',friends.add);
	app.post(API_PREFIX+'/followers/remove',friends.remove);

	app.post(API_PREFIX+'/preferences',preferences.main);

	app.get(API_PREFIX+'/config',appPreferences.main);

}