var express   = require('express')
	,app        = express()
	,server     = require('http').createServer(app)
	,io         = require('socket.io').listen(server)
	,mongoose   = require('mongoose')
  ,routes       = require('./router/routes')
  ,SchemaChat = require('./models/chat')
	,users      = {}
  ,express    = require('express')
  ,fs         = require('fs')  
  ,chat       = require('./controllers/chat')
  ,bodyParser = require('body-parser');
  //serve

  app.set('port', process.env.PORT || 3005);
  
  //mongoose.connect('mongodb://192.254.67.45/chatData', function(err){
  mongoose.connect('mongodb://localhost/wishapic', function(err){
    if(err){
      console.log(err);
    } else{
      console.log('Connected to mongodb!');
    }
  });

  server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
  }
);
//mock
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/2', function(req, res){
    res.sendFile(__dirname + '/index2.html');
  });
//Init Router
routes.init(app);
//Init chat
chat.init(io);
