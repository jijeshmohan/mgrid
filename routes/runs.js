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

exports.details = function (req,res){
  models.Run.find({where:{id: req.params["id"]},include:[{model: models.RunItem,include: [{model: models.Scenario},{model: models.Device}]}]}).success(function (run) {
    if(!run){
      res.send(404,"Unable to find run");
      return;
    }
     res.render('runs/details',{menu: 'runs',run: run,_: _})
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
    models.Device.runningCount().success(function(count){
      if (devices === null){
        devices=[];
      }
      res.render('runs/new', {
       msg: req.session.messages,
       menu: 'runs',
       devices: devices,
       runningCount: count
     });
      req.session.messages = [];
     });
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
       if(req.body.runType==="All" || req.body.devices.length ===1){
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
  
  models.RunItem.update(
    {status: 'Running'}, 
    {runId: run.id}
    );

  models.Test.findAll().success(function(tests){
     models.QueueTest.bulkCreate(_.map(tests,function(test){return _.pick(test,'name','uri','feature')})).success(function(){
      models.QueueDevice.bulkCreate(_.map(results,function(r){return {deviceId: r.deviceId, runId: r.id}; })).success(function(){
        _.each(results,function(r){
           models.Device.find(r.deviceId).success(function(device){
            device.status="running"
            device.save(['status']);
            sio.sockets.emit('device_status', {id: device.id, status: 'Running'})
          });
        });
        scheduledRun();
        scheduleInterval = setInterval(scheduledRun,1000*15);
      }).error(function(){
        console.log("ERROR: while creating device queue!");
        models.QueueTest.destroy().success(function(){}).error(function(){});
      });
    }).error(function(){
        console.log("ERROR: while creating tests queue!");
    });
  });
}

function scheduledRun(){
  models.QueueTest.pendingTests().success(function(tests){
    if(!tests || tests.length === 0){
      models.QueueDevice.runningDevicesCount().success(function(c){
        if(c===0){
           models.QueueDevice.all().success(function(devices){
             var runItemIds=_.pluck(devices,'runId');
             updateRunItem(runItemIds);
             models.QueueDevice.destroy().success(function(){}).error(function(){});
           });
           clearInterval(scheduleInterval);
           scheduleInterval=null;
        }
      });
      return;
    }
    models.QueueDevice.availableDevices().success(function(devices){
      for (var i = 0; i < devices.length;i++) {
        if(tests.length < i+1){
          return;
        }
        runScenarioOnDevice(tests[i],devices[i]);
      }
    });
  });
}

function updateRunItem (runItemIds) {
  models.RunItem.findAll({where : {id: runItemIds}, include: [{model: models.Scenario}] }).success(function(runItems){
    runItems.forEach(function(runItem){
      var status=""
      if(_.every(runItem.scenarios,function(s){return s.status === 'Passed'})){ 
        status="Passed"
      }else{
        status="Failed"
      }
      runItem.status=status;
       models.Device.find(runItem.deviceId).success(function(device){
        device.status="available"
        device.save(['status']);
        sio.sockets.emit('device_status', {id: device.id, status: 'Available'})
      });
      runItem.save().error(function(){
        console.log("Error while updating runitem");
      });
    });
  });
}

function runScenarioOnDevice(test,device){
  test.updateStatus('Running').success(function(){
    device.updateStatus('Running').success(function(){
       sio.sockets.clients().forEach(function (socket) {
        socket.get("deviceId", function (err, id) {
          if(id === device.deviceId){
            socket.set("runitemId",device.runId);
            socket.set("testId",test.id);
            socket.emit("execute_scenario",{runitem_id: device.id,scenario: test});
          }
        });
      });
    }).error(function(){
      test.updateStatus('Pending');
    });
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
