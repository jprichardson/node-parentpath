var fs = require('fs')
  , path = require('path');


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

module.exports = function (search, callback) {
  module.exports.find(search).end(callback)  
}

module.exports.find = function (search){
  var pp = new ParentPath();
  return pp.find(search);
}



