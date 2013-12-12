var form = require('express-form'),
    field = form.field;

exports.list = function(req, res) {
    models.Run.findAll({order: 'createdAt DESC'}).success(function(runs) {
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


exports.create = function(req, res) {
    if (!req.form.isValid) {
        req.session.messages = req.form.errors;
        res.redirect('/runs/new');
    } else {
          models.Run.create({
              name: req.body.name,
              status: 'Not Started',
              runType: req.body.runType,
              comments: req.body.comments
          }).success(function() {
                res.redirect('/runs');
            }).error(function(errors) {
                req.session.messages = ["Error while creating new run", errors.toString()];
                res.redirect('/runs/new');
            });
    }
};


exports.form = form(
    field("name").trim().required(),
    field("runType").trim().required(),
    field("comments").trim().required(),
    field("devices").trim().required()
);
