module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
     all: ['Gruntfile.js', 'model/**/*.js', 'routes/**/*.js']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint'); 

  // task(s).
  grunt.registerTask('default', ['jshint']);

};