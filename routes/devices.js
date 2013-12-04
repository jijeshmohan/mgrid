exports.list = function(req, res){
   models.Device.findAll().success(function(devices) {
     res.render('devices/index',{devices: devices});
  }).error(function(error) {
    res.send(error);
  });
};

exports.newDevice = function (req,res) {
    res.render('devices/new',{msg: req.session.messages});
    req.session.messages=[];
};

exports.create = function (req,res) {
	models.Device.create({name: req.body.name,status: 'disconnected', platform: req.body.platform, deviceType: req.body.deviceType, osVersion: req.body.osVersion})
	.success(function () {
		res.redirect('/devices');
	}).error(function(errors){
		req.session.messages=["Error while creating new device",errors.toString()];
		res.redirect('/devices/new');
	});
};