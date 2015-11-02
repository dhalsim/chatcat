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
      options: {
        logConcurrentOutput: true
      },
      dev: {
        tasks: [
          'exec:mongo',
          'exec:redis',
          'nodemon',
          'watch:all'
        ]
      },
      test: {
        tasks: [
          'exec:mongo',
          'exec:redis'
        ]
      }
    },
    exec: {
      mongo: {
        command: './mongo.sh'
      },
      redis: {
        command: './redis.sh'
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          watch: [
            'app.js',
            'Gruntfile.js',
            'src/**/*.js'
          ]
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
          'src/**/*.js'
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
    'concurrent:test'
  ]);

  grunt.registerTask('prod', [
    'setEnvironment:prod',
    'express:all',
    'watch:all'
  ]);
};
