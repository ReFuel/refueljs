module.exports = function(grunt) {
  grunt.initConfig({
    meta: {
      version: '0.1.0'
    },
    dirs: { 
      refuel: '../',
      libs: '../lib/'
    },
    
    concat: {
      options: {
        separator: ''
      },
      dist: {
          src: ['<%= dirs.libs %>/require.min.js', '<%= dirs.refuel %>/config.js', '<%= dirs.refuel %>/config.modules.js','<%= dirs.refuel %>/Refuel.js','<%= dirs.refuel %>/config.modules.js','<%= dirs.refuel %>/ajax.js','<%= dirs.refuel %>/Events.js','<%= dirs.refuel %>/AbstractModule.js','<%= dirs.refuel %>/ObservableArray.js','<%= dirs.refuel %>/Observer.js','<%= dirs.refuel %>/Template.js','<%= dirs.refuel %>/DataSource.js','<%= dirs.refuel %>/GenericModule.js','<%= dirs.refuel %>/ListModule.js','<%= dirs.refuel %>/ListItemModule.js','<%= dirs.refuel %>/SaytModule.js','<%= dirs.refuel %>/ScrollerModule.js'],    
          dest: 'refuel.build.js'
      }
    },
    
    uglify: {
      dist: {
          src: [
          '<%= dirs.libs %>/require.min.js',
          '<%= dirs.refuel %>/config.modules.js',
          '<%= dirs.refuel %>/Refuel.js',
          '<%= dirs.refuel %>/ajax.js',
          '<%= dirs.refuel %>/Events.js',
          '<%= dirs.refuel %>/AbstractModule.js',
          '<%= dirs.refuel %>/ObservableArray.js',
          '<%= dirs.refuel %>/Observer.js',
          '<%= dirs.refuel %>/Template.js',
          '<%= dirs.refuel %>/DataSource.js',
          '<%= dirs.refuel %>/GenericModule.js',
          '<%= dirs.refuel %>/ListModule.js',
          '<%= dirs.refuel %>/ListItemModule.js',
          '<%= dirs.refuel %>/SaytModule.js',
          '<%= dirs.refuel %>/ScrollerModule.js'
          ]
          ,dest: 'refuel.min.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
 // grunt.loadNpmTasks('grunt-yui-compressor');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-css');
  
  // Default task.
  grunt.registerTask('default', ['concat','uglify']);

};


