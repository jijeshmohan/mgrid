module.exports = function(app) {

    // home
    var home = require('./home');
    app.get('/', home.list);

    //device
    var devices = require('./devices');
    app.get('/devices', devices.list);
    app.get('/devices/new', devices.newDevice);
    app.post('/devices',devices.form,devices.create);
};
