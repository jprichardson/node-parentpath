Node.js - parentpath
================

Find a path in a parent directory.


Why?
----

Let's say that you are building an app that generates file structures. You want the users of your app to navigate to this file directory or any subdirectory and be able to run the commands of your app.

Think `rails g model` from the Rails root directory or any subdirectory.



Installation
------------

    npm install parentpath



Example
------

**Note: I'm not quite happy with the API, so it should be considered unstable.**

Let's say we have the following directory:

    /users/jp
    └── mynewblog
        ├── potter
        │   ├── pages
        │   │   └── animals
        │   │       ├── animals.md
        │   │       ├── mammals
        │   │       │   └── humans
        │   │       └── reptiles
        │   │           └── snakes
        │   │               └── reptiles.md
        │   └── potter.json
        └── articles
            └── cool_article.md


```javascript
var parent = require('parentpath')
process.chdir('/users/jp/mynewblog/potter/pages/animals/repites');
parent.find('potter').end(function(dir) {
    console.log(dir); // = /users/jp/mynewblog
});
```

Be a bit more precise if you want:

```javascript
var parent = require('parentpath')
process.chdir('/users/jp/mynewblog/potter/pages/animals/repites');
parent.find('potter/potter.json').end(function(dir) {
    console.log(dir); // = /users/jp/mynewblog
});
```


License
-------

(MIT License)

Copyright 2012, JP Richardson  <jprichardson@gmail.com>


