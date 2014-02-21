var _ = require('underscore')._;
var Sequelize = require("sequelize");

sio.configure('production', function() {
    sio.set('log level', 1);
});

sio.sockets.on('connection', function(socket) {
	 var deviceName="";
     socket.on('deviceInfo', function (data) {
	       models.Device.find({where: {name: data.name}})
	       	.success(function(device) {
	       		if(device == null ){
	       			 socket.emit("error","Unable to find device");
	       			 socket.disconnect();
	       			 return;
	       		}
	       		deviceName = device.name;
	       		device.updateStatus(true).error(function(){
	       			deviceName=""
	       			socket.disconnect();
	       		}).success(function(){
	       			socket.set("deviceId",device.id);
	       			socket.set("runitemId",null);
	       			socket.broadcast.emit('device_status', {id: device.id, status: 'Available'})
	       		});
	       	});
	  });

  socket.on('status',function(data){
  	models.RunItem.find(data.runitem.id).success(function(item){
  		item.status=data.status;
  		item.save();
  	})
  });
  
  socket.on('scenarios',function(data){
	  var tests = _.chain(data.result)
	  	 .map(function(feature){
	  	 	return _.map(_.where(feature.elements,{"keyword": "Scenario"}),function(scenario){
	  	 		var scenarioURI=feature.uri+":"+scenario.line;
	  	 		return {name: scenario.name, uri: scenarioURI,feature: feature.name};
	  	 	});
	  	 })
	  	 .flatten()
	  	 .value();

		models.Test.destroy().success(function(rows){
			models.Test.bulkCreate(tests).success(function(){
			}).error(function(){
				console.log(errors);
			});
		}).error(function(){
			console.log(errors);
		});
  });
  
  socket.on('scenario_result',function(data){

  	models.QueueDevice.find(data.id).success(function(device){
  		var runitemId = device.runId;
	    device.updateStatus('Waiting').success(function(){});
	    var results = _.flatten(_.map(_.flatten(_.map(data.result,function(feature){
	  			return _.where(feature.elements,{"keyword": "Scenario"});
		  	})), function(scenario){
				return _.map(scenario.steps,function(s){ return s.result.status});
			}));
	    var status="";
		if(_.every(results,function(s){return s === 'passed'})){
			status="Passed";
		}else if(_.every(results,function(s){return s === 'skipped'})){
			status="Skipped";
		}else{
			status="Failed";
		}
	    models.Scenario.create({name: data.scenario.name,feature: data.scenario.feature,status: status,runitemId: runitemId});
	    models.QueueTest.find(data.scenario.id).success(function(test){
	    	test.destroy();
	    });
  	});
  	socket.set("runitemId",null);
    socket.set("testId",null);
  });

  socket.on('result',function(data){
  	socket.set("runitemId",null);
	var isPassed = _.every(_.flatten(_.map(_.flatten(_.map(data.result,function(feature){
	  		return _.where(feature.elements,{"keyword": "Scenario"});
	  	})), function(scenario){
			return _.map(scenario.steps,function(s){ return s.result.status});
		})),function(s){return s === 'passed'});

	_.each(data.result,function(feature){
		var feature_name = feature.name;
		var map = new Object();
		var scenarios= _.map(_.filter(feature.elements,function(element){return element.keyword === "Scenario" || element.keyword === "Scenario Outline"}),function(scenario){
			var results = _.flatten(_.map(scenario.steps,function(s){ return s.result.status}));
			var status="";
			if(_.every(results,function(s){return s === 'passed'})){
				status="Passed";
			}else if(_.every(results,function(s){return s === 'skipped'})){
				status="Skipped";
			}else{
				status="Failed";
			}
			var scenarioName = scenario.name;
			if(scenario.keyword==="Scenario Outline"){
				map[scenario.name]=map[scenario.name]?map[scenario.name]+1:1;
				scenarioName+="_"+map[scenario.name];
			}
			return {name: scenarioName,feature: feature_name,status: status,runitemId: data.id}
		});

		models.Scenario.bulkCreate(scenarios)
			.error(function(){
				console.log("error while saving scenarios" );
			});
	});

	models.RunItem.find(data.id).success(function(item){
  		if(isPassed){
  			item.status="Passed";
  		}else{
  			item.status="Failed";
  		}
  		item.save().error(function(){
  			console.log("Error while updating runitem");
  		});
  	});
  });

     // Disconnect
  socket.on('disconnect', function (data) {
  	 console.log("disconnect: " + deviceName)
  	 models.Device.find({where: {name: deviceName}})
       	.success(function(device) {
       		if (deviceName !== ""){
       			socket.get("runitemId",function (err, value) {
       				if(err){
       					console.log(err);
       				}
       				console.log("Runitem ID " + value)
     				if(value !== null){
     					socket.set("runitemId",null);
     					models.RunItem.find(value).success(function(item){
     						item.status="Error";
     						item.save().error(function(){
					  			console.log("Error while updating runitem");
					  		});
					  		models.QueueDevice.destroy({runId: item.id});
					  		socket.get("testId",function(err,testId){
     							socket.set("testId",null);
     							models.QueueTest.find(testId).success(function(test){
     								test.updateStatus("Pending");
     							});
					  		});
     					}).error(function(){});
     				}
    			});
	       		deviceName = device.name;
	       		device.updateStatus(false).error(function(){
	       			console.log("Unable to update the device status")
	       		}).success(function () {
	       			socket.broadcast.emit('device_status', {id: device.id, status: 'Disconnected'})
	       		});
       		}
       	});
  });
});



