module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        files:
          'js/app.js': 'coffee/app.coffee'

    watch:
      coffee:
        files: ['coffee/*', 'sass/*']
        tasks: ['coffee', 'uglify', 'compass']

    uglify:
      vex:
        src: 'js/app.js'
        dest: 'js/app.min.js'
        options:
          banner: '/*! app.js <%= pkg.version %> */\n'

    compass:
      dist:
        options:
          sassDir: 'sass'
          cssDir: 'css'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-compass'

  grunt.registerTask 'default', ['coffee', 'uglify', 'compass']