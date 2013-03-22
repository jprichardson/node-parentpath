var fs = require('fs-extra')
  , ppSync = require('../lib/parentpath').sync
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

describe('parentpath / sync', function(){
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


  it('should find the path of a parent dir', function(){
    var snakeDir = ''
    DIRS.forEach(function(d) {
      if (S(d).endsWith(d))
        snakeDir = d
    })
    if (!snakeDir) return done(new Error('Cant find snake dir.'))

    process.chdir(snakeDir)
    var dir = removePrivate(ppSync('skyblog/'))
    EQ (dir, TEST_DIR);
  })


  it('should find the path of a parent path', function() {
    var snakeDir = ''
    DIRS.forEach(function(d) {
      if (S(d).endsWith(d))
        snakeDir = d
    })
    if (!snakeDir) return (new Error('Cant find snake dir.'))

    process.chdir(snakeDir)

    var dir = removePrivate(ppSync('skyblog/sky.json'))
    EQ (dir, TEST_DIR);
  })

  it('should find the animals file', function() {
    var snakeDir = ''
    DIRS.forEach(function(d) {
      if (S(d).endsWith(d))
        snakeDir = d
    })
    if (!snakeDir) return (new Error('Cant find snake dir.'))

    process.chdir(snakeDir)

    var dir = removePrivate(ppSync('animals.md'))
    EQ (dir, path.join(TEST_DIR, 'skyblog/pages/animals'))
  })

  it('should return null if the parent path cant be found', function() {
    var snakeDir = ''
    DIRS.forEach(function(d) {
      if (S(d).endsWith(d))
        snakeDir = d
    })
    if (!snakeDir) return (new Error('Cant find snake dir.'))

    process.chdir(snakeDir)

    var dir = ppSync('skyblog/per.json')
  })

  it('should match the current directory too', function() {
    var file = path.join(TEST_DIR, 'sky', 'config.json')
    fs.createFileSync(file)

    process.chdir(TEST_DIR)
    var dir = removePrivate(ppSync('sky/config.json'))
  })
})


