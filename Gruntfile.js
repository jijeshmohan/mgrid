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
     all: ['Gruntfile.js', 'model/**/*.js', 'routes/**/*.js']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint'); 
  grunt.loadNpmTasks('grunt-sequelize');
  // task(s).
  grunt.registerTask('default', ['jshint']);

};