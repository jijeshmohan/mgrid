
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var partials = require('express-partials');
var http = require('http');
var path = require('path');

var app = express();

GLOBAL.app = app

var Sequelize = require("sequelize");

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/config')[env];

var dbpath = __dirname + "/" + config.storage;

var sequelize = new Sequelize(config.database,'' , '', {
   dialect: 'sqlite',
   omitNull: true,
   storage:  dbpath
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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Models

GLOBAL.models = require('./model')(sequelize)

// Routes
require('./routes')(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
