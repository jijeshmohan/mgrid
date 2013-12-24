var _ = require('underscore')._;

sio.configure('production', function() {
    io.set('log level', 1);
});

sio.sockets.on('connection', function(socket) {
	 var deviceName="";
     socket.on('deviceInfo', function (data) {
	       models.Device.find({where: {name: data.name}})
	       	.success(function(device) {
	       		if(device == null ){
	       			 socket.disconnect();
	       			 return;
	       		}
	       		deviceName = device.name;
	       		device.updateStatus(true).error(function(){
	       			deviceName=""
	       			socket.disconnect();
	       		}).success(function(){
	       			socket.set("deviceId",device.id);
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

  socket.on('result',function(data){

	var isPassed = _.every(_.flatten(_.map(_.flatten(_.map(data.result,function(feature){
	  		return _.where(feature.elements,{"keyword": "Scenario"});
	  	})), function(scenario){
			return _.map(scenario.steps,function(s){ return s.result.status});
		})),function(s){return s === 'passed'});

	models.RunItem.find(data.id).success(function(item){
  		if(isPassed){
  			item.status="Passed";
  		}else{
  			item.status="Failed";
  		}
  		item.comments=data.result;
  		item.save();
  	});
	
  });

     // Disconnect
  socket.on('disconnect', function (data) {
  	 console.log("disconnect" + deviceName)
  	 models.Device.find({where: {name: deviceName}})
       	.success(function(device) {
       		if (deviceName !== ""){
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



