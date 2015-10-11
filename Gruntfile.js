module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var path = require('path');

  grunt.initConfig({
    setEnvironment:{
      dev: 'development',
      prod: 'production',
      test: 'test'
    },
    concurrent: {
      dev: {
        options: {
          logConcurrentOutput: true
        },
        tasks: [
          'exec:mongo',
          'exec:redis',
          'watch:all',
          'express:all'
        ]
      }
    },
    exec: {
      mongo: {
        command: 'mongod'
      },
      redis: {
        command: 'redis-server'
      }
    },
    express: {
      options: {
        background: false
      },
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
    'concurrent:dev'
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
