var Sequelize = require("sequelize");

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config')[env];

var dbpath = __dirname + "/../" + config.storage;

var sequelize = new Sequelize(config.database,'' , '', {
   dialect: 'sqlite',
   omitNull: true,
   storage:  dbpath
});

var models = {
  // Device: sequelize.import(__dirname + '/device'),
};

// Associations


//sequelize.sync();
module.exports = models;
