var fs = require('fs-extra')
  , pp = require('../lib/parentpath')
  , testutil = require('testutil')
  , S = require('string')
  , exec = require('child_process').exec
  , P = require('autoresolve')
  , walker = require('walker')
  , path = require('path')

var TEST_DIR = ''
  , DIRS = []
  , RESOURCE_DIR = P('test/resources')

function removePrivate(dir) {
  if (dir === null) return null

  if (dir.indexOf('/private/tmp') === 0)  //MAC OS X symlinks /tmp to /private/tmp
    dir = dir.replace('/private', '');
  return dir
}

describe('parentpath', function(){
  beforeEach(function(done) {
    TEST_DIR = testutil.createTestDir('parentpath');
    process.chdir(TEST_DIR)

    TEST_DIR = path.join(TEST_DIR, 'test')
    TEST_DIR = removePrivate(TEST_DIR)

    fs.copy(RESOURCE_DIR, TEST_DIR, function(err) {
      walker(TEST_DIR)
      .on('dir', function(dir) {
        DIRS.push(dir)
      })
      .on('end', function() {
        done()
      })
    })
  })


  it('should find the path of a parent dir', function(done){
    var snakeDir = ''
    DIRS.forEach(function(d) {
      if (S(d).endsWith(d))
        snakeDir = d
    })
    if (!snakeDir) done(new Error('Cant find snake dir.'))

    process.chdir(snakeDir)
    pp('skyblog/', function(dir) {
      dir = removePrivate(dir)
        
      EQ (dir, TEST_DIR);
      done()
    })
  })


  it('should find the path of a parent path', function(done) {
    var snakeDir = ''
    DIRS.forEach(function(d) {
      if (S(d).endsWith(d))
        snakeDir = d
    })
    if (!snakeDir) done(new Error('Cant find snake dir.'))

    process.chdir(snakeDir)

    pp('skyblog/sky.json', function(dir) {
      dir = removePrivate(dir)

      EQ (dir, TEST_DIR);
      done();
    })
  })

  it('should find the animals file', function(done) {
    var snakeDir = ''
    DIRS.forEach(function(d) {
      if (S(d).endsWith(d))
        snakeDir = d
    })
    if (!snakeDir) done(new Error('Cant find snake dir.'))

    process.chdir(snakeDir)
    pp('animals.md', function(dir) {
      dir = removePrivate(dir)
      
      EQ (dir, path.join(TEST_DIR, 'skyblog/pages/animals'))
      done();
    })
  })

  it('should return null if the parent path cant be found', function(done) {
    var snakeDir = ''
    DIRS.forEach(function(d) {
      if (S(d).endsWith(d))
        snakeDir = d
    })
    if (!snakeDir) done(new Error('Cant find snake dir.'))

    process.chdir(snakeDir)

    pp('skyblog/per.json', function(dir) {
      EQ (dir, null);
      done();
    })
  })

  it('should match the current directory too', function(done) {
    var file = path.join(TEST_DIR, 'sky', 'config.json')
    fs.createFileSync(file)

    process.chdir(TEST_DIR)
    pp('sky/config.json', function(dir) {
      dir = removePrivate(dir)
      EQ (dir, TEST_DIR)
      done()
    })
  })
})


