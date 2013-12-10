var form = require('express-form'),
    field = form.field;

exports.list = function(req, res) {
    models.Run.findAll().success(function(runs) {
        res.render('runs/index', {
            runs: runs,
            menu: 'runs'
        });
    }).error(function(error) {
        res.send(error);
    });
};
