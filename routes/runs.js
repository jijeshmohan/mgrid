var form = require('express-form'),
   _ = require('underscore')._,
  field = form.field;

var Sequelize = require("sequelize");

exports.list = function(req, res) {
  models.Run.findAll({order: 'createdAt DESC',include:[{model: models.RunItem,include: [{model: models.Scenario},{model: models.Device}]}]}).success(function(runs) {
    res.render('runs/index', {
      runs: runs,
      menu: 'runs'
    });
  }).error(function(error) {
    res.send(error);
  });
};

exports.compare = function (req,res){
  models.Run.find({where:{id: req.params["id"]},include:[{model: models.RunItem,include: [{model: models.Scenario},{model: models.Device}]}]}).success(function (run) {
    if(!run){
      res.send(404,"Unable to find run");
      return;
    }
     res.render('runs/compare',{menu: 'runs',run: run,_: _})
  }).error(function(error){
    res.send(error);
  });
};

exports.show = function (req,res) {

  models.Run.find(req.params["id"]).success(function (run) {
    if(!run){
      res.send(404,"Unable to find run");
      return;
    }
    models.RunItem.findAll({where:{runId: run.id},include:[models.Device,models.Scenario]}).success(function (runItems) {
     res.render('runs/show',{menu: 'runs',run: run,runItems: runItems})
   });
    
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
       if(req.body.runType==="All"){
          sendRunRequests(results);
        }else{
          executeAllTests(run, results);
        }
    }).error(function  (errors) {
     req.session.messages = ["Error while creating new run", errors.toString()];
     res.redirect('/runs/new');
   });
  }).error(function(errors) {
    req.session.messages = ["Error while creating new run", errors.toString()];
    res.redirect('/runs/new');
  });
}

function executeAllTests(run,results){
  models.Test.findAll().success(function(tests){
     models.QueueTest.bulkCreate(tests,['name','uri','feature']).success(function(){
      // TODO
    }).error(function(){});
  });
}

function sendRunRequests  (runItems) {
  runItems.forEach(function(item){
   sio.sockets.clients().forEach(function (socket) {
    socket.get("deviceId", function (err, id) {
      if(id === item.deviceId){
        socket.set("runitemId",item.id);
        socket.emit("execute",{runitem: item});
      }
    });
  });
 });
}

exports.form = form(
  field("runType").trim().required(),
  field("comments").trim().required(),
  field("devices").trim().required()
  );
