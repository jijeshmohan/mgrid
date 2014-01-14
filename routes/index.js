module.exports = function(app) {

    // home
    var home = require('./home');
    app.get('/', home.list);

    //device
    var devices = require('./devices');
    app.get('/devices', devices.list);
    app.get('/devices/new', devices.newDevice);
    app.post('/devices',devices.form,devices.create);

    //device
    var runs = require('./runs');
    app.get('/runs', runs.list);
    app.get('/runs/new', runs.newRun);
    app.post('/runs',runs.form,runs.create);
    app.get('/runs/:id',runs.show);
    app.get('/runs/:id/compare',runs.compare);
};
