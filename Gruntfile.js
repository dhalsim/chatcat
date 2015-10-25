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
          'nodemon',
          'watch:all'
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
          nodeArgs: ['--debug'],
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
    'express:all',
    'watch:all'
  ]);

  grunt.registerTask('prod', [
    'setEnvironment:prod',
    'express:all',
    'watch:all'
  ]);
};
