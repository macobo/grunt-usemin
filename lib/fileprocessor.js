'use strict';

//
// FileProcessor takes care, and processes arbitary files which contain image paths within quoted strings.
// It is given:
//   - A base directory, which is the directory under which to look at references files
//   - A destination directory, which is the directory under which will be generated the files
//   - A file content to be processed
//   - a file replacement locator
//   - a destination directory (optional)
//   - an optional log callback that will be called as soon as there's something to log
//
var FileProcessor = module.exports = function (src, dest, content, revvedfinder, logcb) {
  this.content = content;
  this.filepath = src;
  this.linefeed = /\r\n/g.test(this.content) ? '\r\n' : '\n';
  this.revvedfinder = revvedfinder;
  this.logcb = logcb || function () {};
};

//
// Calls the log callback function
//
FileProcessor.prototype.log = function log(msg) {
  this.logcb(msg);
};

// Process the file, which is:
//  - replace image references by their revved version
//
FileProcessor.prototype.process = function process() {
    var self = this;
    // Replace reference to images with the actual name of the optimized image
    this.log('Update the file with new img filenames');
    return this.content.replace(/"([^"\)#?]+)(?:[#?](?:[^'\)]*))?"/gm, function (match, src) {
      // Consider reference from site root
      var file = self.revvedfinder.find(src, self.filepath);
      var res = match.replace(src, file);

      if (src !== file) {
        self.log(match + ' changed to ' + res);
      }
      return res;
    });
  };
