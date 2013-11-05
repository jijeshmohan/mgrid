module.exports = function(app) {

  // home
  var home = require('./home');
  app.get('/', home.list);


};
