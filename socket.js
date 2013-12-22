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



