var assert = require('assert')
  , fs = require('fs-extra')
  , parent = require('../lib/parentpath')
  , path = require('path-extra')
  , testutil = require('testutil')
  , batch = require('batchflow')
  , next = require('nextflow') 
  , S = require('string')
  , exec = require('child_process').exec;

TEST_DIR = '', DIRS = [];

var pj = path.join;

describe('parentpath', function(){
    
    beforeEach(function(done) {
        TEST_DIR = testutil.generateTestPath('test-parentpath');
        if (S(TEST_DIR).startsWith('/private/tmp')) { //MAC OS X symlinks /tmp to /private/tmp
            TEST_DIR = TEST_DIR.replace('/private', '');
            console.log('HI: ' + TEST_DIR)
        }

        TEST_DIR = path.resolve(TEST_DIR)

        var dirs = [];
        dirs[0] = pj(TEST_DIR, 'potter')
        dirs[1] = pj(dirs[0], 'pages')
        dirs[2] = pj(dirs[1], 'animals')
        dirs[3] = pj(dirs[2], 'reptiles')
        dirs[4] = pj(dirs[2], 'mammals')
        dirs[5] = pj(dirs[3], 'snakes')
        dirs[6] = pj(dirs[4], 'humans')
        
        var files = [];
        files[0] = path.join(dirs[0], 'potter.json')
        files[1] = path.join(dirs[2], 'animals.md')
        files[2] = path.join(dirs[5], 'reptiles.md')

        DIRS = dirs;

        next({
            ERROR: function(err) {
                done(err);
            },
            createTD: function() {
                 var self = this;
                fs.mkdir(TEST_DIR, this.next);
            },
            createDirs: function(){
                var self = this;
                batch(dirs).seq().each(function(i, dir, done){ fs.mkdir(dir, done); }).end(function(){ self.next(); });        
            },
            createFiles: function() {
                var self = this;
                batch(files).par().each(function(i, file, done){ fs.writeFile(file, done); }).end(function(){ done(); });
            }
        });
    })


    it('should find the path of a parent dir', function(done){
        process.chdir(DIRS[3]);        
        parent.find('potter/').end(function(dir) {
            if (dir) {
                if (S(dir).startsWith('/private/tmp')) { //MAC OS X symlinks /tmp to /private/tmp
                    dir = dir.replace('/private', '');
                }
            }

            assert(dir === TEST_DIR);
            done();
        })
    
    })


    it('should find the path of a parent path', function(done) {
        process.chdir(DIRS[3]);
         parent.find('potter/potter.json').end(function(dir) {
            if (dir) {
                if (S(dir).startsWith('/private/tmp')) { //MAC OS X symlinks /tmp to /private/tmp
                    dir = dir.replace('/private', '');
                }
            }

            assert(dir === TEST_DIR);
            done();
        })
    })

    it('should return null if the parent path cant be found', function(done) {
        process.chdir(DIRS[3]);
         parent.find('potter/per.json').end(function(dir) {
            assert(dir === null);
            done();
        })
    })
})


