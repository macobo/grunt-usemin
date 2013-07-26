'use strict';
var assert = require('assert');
var FileProcessor = require('../lib/fileprocessor');

describe('fileprocessor', function () {
  it('should initialize correctly', function () {
    var cp = new FileProcessor('', '', '\n', 3);
    assert(cp !== null);
    assert.equal(3, cp.revvedfinder);
    assert.equal('\n', cp.linefeed);
  });

  describe('process', function () {
    var mapping = {
      'images/pic.png': 'images/2123.pic.png',
      '/images/pic.png': '/images/2123.pic.png',
      '../../images/pic.png': '../../images/2123.pic.png',
      'fonts/awesome-font.svg': 'fonts/2123.awesome-font.svg',
    };
    var revvedfinder = {
      find: function (s) {
        return mapping[s] || s;
      }
    };

    it('should update the file with new img filenames', function () {
      var content = '{ "abc": "images/pic.png" }';
      var cp = new FileProcessor('', '', content, revvedfinder);
      var awaited = '{ "abc": "images/2123.pic.png" }';
      assert.equal(awaited, cp.process());
    });

    it('should replace file referenced from root', function () {
      var content = '{ "abc": "/images/pic.png" }';
      var cp = new FileProcessor('', '', content, revvedfinder);
      var awaited = '{ "abc": "/images/2123.pic.png" }';
      assert.equal(awaited, cp.process());
    });

    it('should not replace external references', function () {
      var content = '{ "abc": "http://images/pic.png" }';
      var cp = new FileProcessor('', '', content, revvedfinder);
      var awaited = '{ "abc": "http://images/pic.png" }';
      assert.equal(awaited, cp.process());
    });

    it('should take into account relative paths', function () {
      var content = '{ "abc": "../../images/pic.png" }';
      var cp = new FileProcessor('', 'build/css', content, revvedfinder);
      var awaited = '{ "abc": "../../images/2123.pic.png" }';
      assert.equal(awaited, cp.process());
    });

    it('should support hashes in urls', function () {
      var content = '{ "key": "fonts/awesome-font.svg#browser-hack" }';
      var cp = new FileProcessor('', 'build/css', content, revvedfinder);
      var awaited = '{ "key": "fonts/2123.awesome-font.svg#browser-hack" }';
      assert.equal(awaited, cp.process());
    });

    it('should support hashes in urls', function () {
      var content = '{ "key": "fonts/awesome-font.svg?#iefix" }';
      var cp = new FileProcessor('', 'build/css', content, revvedfinder);
      var awaited = '{ "key": "fonts/2123.awesome-font.svg?#iefix" }';
      assert.equal(awaited, cp.process());
    });
  });
});
