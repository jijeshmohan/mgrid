module.exports = function(app) {

  // home
  var home = require('./home');
  app.get('/', home.list);

  //device
  var devices = require('./devices');
  app.get('/devices',devices.list)
};
