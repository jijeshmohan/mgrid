var form = require('express-form'),
      field = form.field;

var Sequelize = require("sequelize");

exports.list = function(req, res) {
  models.Run.findAll({order: 'createdAt DESC',include:[models.RunItem]}).success(function(runs) {
    res.render('runs/index', {
      runs: runs,
      menu: 'runs'
    });
  }).error(function(error) {
    res.send(error);
  });
};

exports.show = function (req,res) {

  models.Run.find(req.params["id"]).success(function (run) {
    if(!run){
      res.send(404,"Unable to find run");
    }
    res.render('runs/show',{menu: 'runs',run: run})
  }).error(function(error){
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
    createNewRun(req,res);
  }
};

function createNewRun (req,res) {

  var chainer=new Sequelize.Utils.QueryChainer;

  chainer.add(models.Run.create({
      name: req.body.name,
      status: 'Not Started',
      runType: req.body.runType,
      comments: req.body.comments
    }));

  for (var i = req.body.devices.length - 1; i >= 0; i--) {
    chainer.add(models.RunItem.create({deviceId: parseInt(req.body.devices[i])}));
  }

   chainer.run().success(function(results){
    run = results[0];
    results.shift()
    run.setRunitems(results).success(function(){
        res.redirect('/runs');
      }).error(function  (errors) {
         req.session.messages = ["Error while creating new run", errors.toString()];
        res.redirect('/runs/new');
      });
   }).error(function(errors) {
        req.session.messages = ["Error while creating new run", errors.toString()];
        res.redirect('/runs/new');
    });
}


exports.form = form(
  field("name").trim().required(),
  field("runType").trim().required(),
  field("comments").trim().required(),
  field("devices").trim().required()
  );
