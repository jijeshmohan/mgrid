var form = require('express-form'),
    field = form.field;

exports.list = function(req, res) {
    models.Device.findAll().success(function(devices) {
        res.render('devices/index', {
            devices: devices,
            menu: 'devices'
        });
    }).error(function(error) {
        res.send(error);
    });
};

exports.newDevice = function(req, res) {
    res.render('devices/new', {
        msg: req.session.messages,
        menu: 'devices'
    });
    req.session.messages = [];
};

exports.create = function(req, res) {
    if (!req.form.isValid) {
        req.session.messages = req.form.errors;
        res.redirect('/devices/new');
    } else {
        models.Device.create({
            name: req.body.name,
            status: 'disconnected',
            platform: req.body.platform,
            deviceType: req.body.deviceType,
            osVersion: req.body.osVersion
        })
            .success(function() {
                res.redirect('/devices');
            }).error(function(errors) {
                req.session.messages = ["Error while creating new device", errors.toString()];
                res.redirect('/devices/new');
            });
    }
};


exports.form = form(
    field("name").trim().required(),
    field("platform").trim().required(),
    field("deviceType").trim().required(),
    field("osVersion").trim().required()
);
