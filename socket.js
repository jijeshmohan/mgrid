sio.configure('production', function() {
    io.set('log level', 1);
});

sio.sockets.on('connection', function(socket) {
        console.log("connected the device!");
});
