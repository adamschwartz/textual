module.exports = (grunt) ->
  grunt.initConfig

    pkg: grunt.file.readJSON('package.json')

    coffee:
      compile:
        files:
          'js/textual.js': 'coffee/textual.coffee'
          'example/js/example.js': 'example/coffee/example.coffee'

    watch:
      coffee:
        files: ['coffee/*', 'sass/*', 'example/coffee/*.coffee', 'example/sass/*.sass']
        tasks: ['coffee', 'uglify', 'compass']

    uglify:
      vex:
        src: 'js/textual.js'
        dest: 'js/textual.min.js'
        options:
          banner: '/*! textual.js <%= pkg.version %> */\n'

    compass:
      dist:
        options:
          sassDir: 'sass'
          cssDir: 'css'
      example:
        options:
          sassDir: 'example/sass'
          cssDir: 'example/css'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-compass'

  grunt.registerTask 'default', ['coffee', 'uglify', 'compass']