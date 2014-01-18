var Sequelize = require("sequelize");

var env = 'test';
var config = require(__dirname + '/../config/config')[env];

var dbpath = __dirname + "/../" + config.storage;

var sequelize = new Sequelize(config.database,'' , '', {
   dialect: 'sqlite',
   omitNull: true,
   storage:  dbpath,
   maxConcurrentQueries: 100
});

module.exports = sequelize;