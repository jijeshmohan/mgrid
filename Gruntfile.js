var Sequelize = require("sequelize");

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        sequelize: {
            options: {
                migrationsPath: __dirname + '/migrations',
                database: "database_dev",
                dialect: "sqlite",
                storage: "db/database_dev.sqlite"
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                asi: true,
            },
            all: ['Gruntfile.js', 'model/**/*.js', 'routes/**/*.js']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-sequelize');
    // task(s).
    grunt.registerTask('deleteRuns', 'Delete all runs from db', function() {
        grunt.log.writeln('Deleteing data from db');

        var env = process.env.NODE_ENV || 'development';
        var config = require(__dirname + '/config/config')[env];

        var dbpath = __dirname + "/" + config.storage;

        var sequelize = new Sequelize(config.database, '', '', {
            dialect: 'sqlite',
            omitNull: true,
            storage: dbpath
        });

        var models = require('./model')(sequelize);
        var done = this.async();
        models.Run.destroy().success(function() {
            grunt.log.writeln("Deleted runs");
            models.RunItem.destroy().success(function() {
                grunt.log.writeln("Deleted runs items");
                models.Scenario.destroy().success(function() {
                    grunt.log.writeln("Deleted scenarios");
                    done();
                }).error(function() {
                    done();
                });
            }).error(function() {
                done();
            });
        }).error(function() {
            grunt.log.writeln("opps...");
            done();
        });

    });
    grunt.registerTask('default', ['jshint']);

};
