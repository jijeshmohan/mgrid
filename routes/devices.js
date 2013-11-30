exports.list = function(req, res){
   models.Device.findAll().success(function(devices) {
     res.render('devices/index',{devices: devices});
  }).error(function(error) {
    res.send(error);
  });
 
};
