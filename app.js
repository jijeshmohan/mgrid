
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var partials = require('express-partials');
var http = require('http');
var path = require('path');
var moment = require('moment');
var _ = require('underscore')._;
var app = express();

GLOBAL.app = app

var Sequelize = require("sequelize");

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/config')[env];

var dbpath = __dirname + "/" + config.storage;

var sequelize = new Sequelize(config.database,'' , '', {
   dialect: 'sqlite',
   omitNull: true,
   storage:  dbpath,
   maxConcurrentQueries: 100
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(partials());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Handle 404
app.use(function(req, res) {
 res.status(400);
 res.render('404.ejs', {title: '404: File Not Found'});
});

app.use(function(error, req, res, next) {
 res.status(500);
 res.render('500.ejs', {title:'500: Internal Server Error', error: error});
});

app.locals({
	generateStatusClass: function(status){ 
		switch(status.toLowerCase()){ 
			case 'failed':
			case 'error':
			return 'label-danger';
			break; 
			case 'passed': 
			return 'label-success';break; 
			case 'running':
			case 'skipped':
			return 'label-warning';
			break;
			case 'not started':
			return 'label-default';
			break;
		}
	},
	displayIcons: function(status){
		var stat="";
		switch(status.toLowerCase()){
			case 'passed':
				 stat="fa-check green";
				 break;
			case 'skipped':
				 stat="fa-circle-o yellow";
				 break;
			case 'failed':
			case 'error':
				 stat="fa-ban red";
				 break;
		}
		return "<i class=\"fa "+stat+"\"></i>"
	},
	groupScenarios: function(scenarios){
		return _.groupBy(scenarios,function(s){ return s.feature; });
	},
	formatDate: function(datetime){
		return moment(datetime).fromNow();
	} 
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Models
GLOBAL.models = require('./model')(sequelize)

// Routes
require('./routes')(app);

// var server = http.createServer(app);

// GLOBAL.sio = require('socket.io').listen(server);

// require('./socket')

// server.listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

exports.app = app;