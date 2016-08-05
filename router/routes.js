var config       = require('../config/config').main()
	,user        = require('../controllers/user')
	,chat        = require('../controllers/chat')
	,preferences = require('../controllers/preferences')
	,friends     = require('../controllers/friends')
	,mock     	 = require('../controllers/mock')
	,pictures    = require('../controllers/pictures')
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
	// console.log(API_PREFIX+'/happeningNow');
	app.get(API_PREFIX+'/happeningNow',mock.happeningNow);
	app.get(API_PREFIX+'/picturesGranted',mock.picturesGranted);
	app.get(API_PREFIX+'/wished',mock.wished);
	app.get(API_PREFIX+'/granted',mock.granted);
	app.get(API_PREFIX+'/locations',mock.locations);
	app.get(API_PREFIX+'/tags',mock.tags);
	app.get(API_PREFIX+'/followPerson',mock.followPerson);
	app.get(API_PREFIX+'/following',mock.following);
	app.get(API_PREFIX+'/followers',mock.followers);

	app.post(API_PREFIX+'/pictures',pictures.create);
	app.get(API_PREFIX+'/pictures/:id',pictures.getPictureById);
	app.get(API_PREFIX+'/pictures/happeningNow',pictures.getPictureByHappeningNow);
	app.get(API_PREFIX+'/pictures/happeningNow/:userId',pictures.getPictureHappeningNowByUser);
	app.get(API_PREFIX+'/pictures/:userId',pictures.getPictureByUser);

}