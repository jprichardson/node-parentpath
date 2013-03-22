Node.js - parentpath
================

[![build status](https://secure.travis-ci.org/jprichardson/node-parentpath.png)](http://travis-ci.org/jprichardson/node-parentpath)

Find parent directory of a path.


Why?
----

Let's say that you are building an app that generates file structures. You want the users of your app to navigate to this file directory or any subdirectory and be able to run the commands of your app.

Think `rails g model` from the Rails root directory or any subdirectory.



Installation
------------

    npm install parentpath



Example
------

Let's say we have the following directory:

    /users/jp
    └── mynewblog
        ├── sky
        │   ├── pages
        │   │   └── animals
        │   │       ├── animals.md
        │   │       ├── mammals
        │   │       │   └── humans
        │   │       └── reptiles
        │   │           └── snakes
        │   │               └── reptiles.md
        │   └── sky.json
        └── articles
            └── cool_article.md


```javascript
var pp = require('parentpath')
process.chdir('/users/jp/mynewblog/sky/pages/animals/repites');
pp('sky', function(dir) {
  console.log(dir); // = /users/jp/mynewblog
});
```

Be a bit more precise if you want:

```javascript
var parent = require('parentpath')
process.chdir('/users/jp/mynewblog/sky/pages/animals/repites');
parent('sky/sky.json', function(dir) {
  console.log(dir); // = /users/jp/mynewblog
});
```


License
-------

(MIT License)

Copyright 2012, JP Richardson  <jprichardson@gmail.com>


