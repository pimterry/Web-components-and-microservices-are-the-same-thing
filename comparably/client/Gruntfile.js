module.exports = function(grunt) {

    grunt.initConfig({
        'connect': {
            demo: {
                options: {
                    open: true,
                    keepalive: true,
                    hostname: "localhost",
                    port: 8080
                }
            }
        },
        'gh-pages': {
            options: {
                clone: 'bower_components/my-repo'
            },
            src: [
                'bower_components/**/*',
                '!bower_components/my-repo/**/*',
                'demo/*', 'src/*', 'index.html'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('deploy', ['gh-pages']);
    grunt.registerTask('server', ['connect']);

};
