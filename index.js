var app = require('./app.js').app;
var http = require('http');


var server = http.createServer(app);

GLOBAL.sio = require('socket.io').listen(server);

require('./socket')

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});