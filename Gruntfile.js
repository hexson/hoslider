module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				expand: true,
				cwd: 'src/',
				src: '**',
				dest: 'build/',
				filter: 'isFile',
			}
		},
		uglify: {
			dist: {
				options: {
					banner: '/*!\n * <%= pkg.name %>.js@<%= pkg.version %> <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %>\n */\n',
					mangle: true,
				},
				files: {
					'build/hoslider.min.js': 'src/hoslider.js'
				}
			}
		},
		watch: {
			copy: {
				files: 'src/hoslider.js',
				tasks: ['copy:main']
			},
			uglify: {
				files: 'src/*',
				tasks: ['uglify:dist']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['copy', 'uglify', 'watch']);
}