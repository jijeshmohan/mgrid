var form = require('express-form'),
    field = form.field;

exports.list = function(req, res) {
    models.Run.findAll().success(function(runs) {
        res.render('runs/index', {
            runs: runs,
            menu: 'runs'
        });
    }).error(function(error) {
        res.send(error);
    });
};


exports.newRun = function(req, res) {
  models.Device.availableDevices().success(function(devices) { 
    if (devices === null){
      devices=[];
    }
	    res.render('runs/new', {
	        msg: req.session.messages,
	        menu: 'runs',
	        devices: devices
	    });
	    req.session.messages = [];
      }).error(function(error) {
        res.send(error);
     });
};



