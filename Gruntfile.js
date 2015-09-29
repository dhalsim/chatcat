module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var path = require('path');

  grunt.initConfig({
    setEnvironment:{
      dev: 'development',
      prod: 'production',
      test: 'test'
    },
    express: {
      all: {
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
          'routes/*.js',
          'config/*.json',
          'lib/*.js'
        ]
      }
    }
  });

  grunt.registerMultiTask('setEnvironment',
    'sets environment variable to development or production',
    function () {
      process.env.NODE_ENV = this.data;
    }
  );

  grunt.registerTask('dev', [
    'setEnvironment:dev',
    'express:all',
    'watch:all'
  ]);

  grunt.registerTask('test', [
    'setEnvironment:test',
    'express:all',
    'watch:all'
  ]);

  grunt.registerTask('prod', [
    'setEnvironment:prod',
    'express:all',
    'watch:all'
  ]);
};
