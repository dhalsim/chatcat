module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var path = require('path');

  grunt.initConfig({
    express: {
      dev: {
        options: {
          script: path.resolve('./app.js')
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      all: {
        files: [
          'app.js',
          'Gruntfile.js',
          'public/**/*.*',
          'views/**/*.*',
          'routes/*.js'
        ]
      }
    }
  });

  grunt.registerTask('dev', ['express:dev', 'watch:all']);
};
