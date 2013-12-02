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
	       		device.updateStatus(true);
	       	});
	  });

     // Disconnect
  socket.on('disconnect', function (data) {
  	 console.log("disconnect" + deviceName)
  	 models.Device.find({where: {name: deviceName}})
       	.success(function(device) {
       		if (deviceName !== ""){
	       		deviceName = device.name;
	       		device.updateStatus(false);
       		}
       	});
  });
});
