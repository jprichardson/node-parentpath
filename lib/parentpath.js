var fs = require('fs')
  , path = require('path');

//not sure why I made this a class...
//needs to be refactored, can't make it a priority at the moment

function ParentPath(){
  this.searchPath = null;
  this.searchTokens = [];//  --\
  this.currentToken = 0;//   --/  not really utilized like they could be
}

ParentPath.prototype.find = function(str) {
  this.searchPath = str;
  this.searchTokens = str.split(path.sep);
  return this;
};

ParentPath.prototype.end = function(callback) {
  var self = this;

  function again(dir) {
    fs.readdir(dir, function(err, paths) {
      //console.log(paths)
      if (paths.indexOf(self.searchTokens[self.currentToken]) >= 0) {
        var p = path.join(path.resolve(dir), self.searchPath);
        fs.exists(p, function(itDoes) {
          if (itDoes) { 
            callback(path.resolve(dir)); //remove ending PATH SEP if there is one
          } else {
            var newdir = path.join(dir, '../')
            if (newdir != dir) {
              dir = newdir;
              again(dir);
            } else
              callback(null);
          }
        });
      } else {
        var newdir = path.join(dir, '../')
        if (newdir != dir) {
            dir = newdir;
            again(dir);
        } else
            callback(null)
      }
    });
  }   
  again(process.cwd());

  return this;
};

//awful naming convention and style, don't follow this
ParentPath.prototype.endSync = function() {
  var self = this;
  var dirs = [process.cwd()]

  while (dirs.length > 0) {
    var dir = dirs.shift()
    var paths = fs.readdirSync(dir)
    if (paths.indexOf(self.searchTokens[self.currentToken]) >= 0) {
      var p = path.join(path.resolve(dir), self.searchPath);
      if (fs.existsSync(p)) {
        return path.resolve(dir);
      } else {
        var newdir = path.join(dir, '../')
        if (newdir != dir) {
          dirs.push(newdir)
        } else {
          return null;
        }
      }
    }
    else {
      var newdir = path.join(dir, '../')
      if (newdir != dir) {
        dirs.push(newdir)
      } else {
        return null;
      }
    }
  }
}

module.exports = function (search, callback) {
  module.exports.find(search).end(callback)  
}

module.exports.find = function (search){
  var pp = new ParentPath();
  return pp.find(search);
}

module.exports.sync = function(search) {
  var pp = new ParentPath();
  return pp.find(search).endSync()
}





