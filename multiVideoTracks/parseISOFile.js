(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["parseISOFile"] = factory();
	else
		root["parseISOFile"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MultiBufferStream = __webpack_require__(2);

var _MultiBufferStream2 = _interopRequireDefault(_MultiBufferStream);

var _BoxParser = __webpack_require__(4);

var _BoxParser2 = _interopRequireDefault(_BoxParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ISOFile = function () {
  function ISOFile(callback) {
    _classCallCheck(this, ISOFile);

    this.stream = new _MultiBufferStream2.default();
    this.callback = callback || function () {}; //
    /* Array of all moofs */
    this.moofs = [];

    this.lastBoxStartPosition = 0;

    this.position = 0;
    this.previousRequestRangeStartIndex = 0;
  }

  // seek(pos) {
  //   var npos = Math.max(0, Math.min(this.buffer.byteLength, pos))
  //   this.position = isNaN(npos) || !isFinite(npos) ? 0 : npos
  //   return true
  // }

  ISOFile.prototype.restoreParsePosition = function restoreParsePosition() {
    /* Reposition at the start position of the previous box not entirely parsed */
    return this.stream.seek(this.lastBoxStartPosition, true, this.discardMdatData);
  };

  ISOFile.prototype.saveParsePosition = function saveParsePosition() {
    /* remember the position of the box start in case we need to roll back (if the box is incomplete) */
    this.lastBoxStartPosition = this.stream.getPosition();
  };

  ISOFile.prototype.parse = function parse() {
    var ret = void 0,
        box = void 0,
        parseBoxHeadersOnly = true,
        previousBox = null;

    if (this.restoreParsePosition) {
      if (!this.restoreParsePosition()) {
        return;
      }
    }

    while (true) {
      if (false) {} else {
        if (this.saveParsePosition) {
          this.saveParsePosition();
        }
        ret = _BoxParser2.default.parseOneBox(this.stream, parseBoxHeadersOnly);

        if (ret.code === _BoxParser2.default.ERR_NOT_ENOUGH_DATA) {
          //reset position
          // this.stream.position = 0;
          this.stream.seek(0);
          this.lastBoxStartPosition = 0;

          //1.当出现不够的时候,需要重新请求数据
          //1.1 当前是moof不够长度，从当前moof的开始位置重新请求数据
          if ("moof" === ret.type) {
            var rangeStart = this.previousRequestRangeStartIndex + ret.start;
            this.callback({ error: { errorCode: _BoxParser2.default.ERR_NOT_ENOUGH_DATA, nextRangeStart: rangeStart } });
            this.previousRequestRangeStartIndex = rangeStart;
          } else if ("mdat" === ret.type) {
            var _rangeStart = this.previousRequestRangeStartIndex + previousBox.start;
            var currentMoofMdatLength = previousBox.start + previousBox.size + ret.size;
            //1.2 当前是mdat不够长度，从前一个moof的位置开始重新请求
            this.callback({ error: { errorCode: _BoxParser2.default.ERR_NOT_ENOUGH_DATA, nextRangeStart: _rangeStart, currentMoofMdatLength: currentMoofMdatLength } });
            this.previousRequestRangeStartIndex = _rangeStart;
          }

          // if (this.processIncompleteBox) {
          //   if (this.processIncompleteBox(ret)) {
          //     continue
          //   } else {
          //     return
          //   }
          // } else {
          //   return
          //   //1.判断有没有读完，需要请求数据
          //   //2.判断是不是都读完了
          // }
          return;
        }

        this.myBusinessLogic(previousBox, ret);

        //记录当前解析前一个box的信息，用于当前解析的box如果出现长度不够的情况下，记住位置，用于重新请求
        previousBox = ret;

        // else {
        //   let box_type
        //   /* the box is entirely parsed */
        //   box = ret.box
        //   box_type = box.type !== 'uuid' ? box.type : box.uuid
        //   /* store the box in the 'boxes' array to preserve box order (for file rewrite if needed)  */
        //   this.boxes.push(box)
        //   /* but also store box in a property for more direct access */
        //   switch (box_type) {
        //     case 'mdat':
        //       this.mdats.push(box)
        //       break
        //     case 'moof':
        //       this.moofs.push(box)
        //       break
        //     case 'moov':
        //       this.moovStartFound = true
        //       if (this.mdats.length === 0) {
        //         this.isProgressive = true
        //       }
        //     /* no break */
        //     /* falls through */
        //     default:
        //       if (this[box_type] !== undefined) {
        //         console.warn(
        //           'ISOFile',
        //           'Duplicate Box of type: ' + box_type + ', overriding previous occurrence'
        //         )
        //       }
        //       this[box_type] = box
        //       break
        //   }
        //   if (this.updateUsedBytes) {
        //     this.updateUsedBytes(box, ret)
        //   }
        // }
      }
    }
  };

  ISOFile.prototype.myBusinessLogic = function myBusinessLogic(previousBox, ret) {
    if ('moov' === ret.type) {
      //当读到moov的时候开始往推送第一次数据
      this.callback({ boxInfo: ret, arrayBuffer: this.stream.buffer });
    }

    if ('mdat' === ret.type) {
      //之后每次推送一个完整的FMP4 (moof + mdat)的数据
      var trackId = previousBox.box.trafs[0].tfhd.track_id;
      this.callback({
        boxInfo: {
          type: 'moof_mdat',
          start: previousBox.start, //去moof的开始作为起点
          size: previousBox.size + ret.size, //moof的size + moov的size
          trackId: trackId
        },
        arrayBuffer: this.stream.buffer
      });
    }
  };

  /**
   * Processes a new ArrayBuffer (with a fileStart property)
   * Returns the next expected file position, or undefined if not ready to parse
   * @param  {ArrayBuffer}  ab ArrayBuffer
   * @param  {}  last
   */


  ISOFile.prototype.appendBuffer = function appendBuffer(ab, last) {
    var nextFileStart;
    if (!this.checkBuffer(ab)) {
      return;
    }

    /* Parse whatever is in the existing buffers */
    this.parse();

    if (this.stream.cleanBuffers) {
      // Log.info("ISOFile", "Done processing buffer (fileStart: "+ab.fileStart+") - next buffer to fetch should have a fileStart position of "+nextFileStart);
      this.stream.logBufferLevel();
      this.stream.cleanBuffers();
      this.stream.logBufferLevel(true);
      // Log.info("ISOFile", "Sample data size in memory: "+this.getAllocatedSampleDataSize());
    }

    // /* Check if the moovStart callback needs to be called */
    // if (this.moovStartFound && !this.moovStartSent) {
    //   this.moovStartSent = true
    //   if (this.onMoovStart) this.onMoovStart()
    // }

    // if (this.moov) {
    //   /* A moov box has been entirely parsed */

    //   /* if this is the first call after the moov is found we initialize the list of samples (may be empty in fragmented files) */
    //   if (!this.sampleListBuilt) {
    //     this.buildSampleLists()
    //     this.sampleListBuilt = true
    //   }

    //   /* We update the sample information if there are any new moof boxes */
    //   this.updateSampleLists()

    //   /* If the application needs to be informed that the 'moov' has been found,
    //    we create the information object and callback the application */
    //   if (this.onReady && !this.readySent) {
    //     this.readySent = true
    //     this.onReady(this.getInfo())
    //   }

    //   /* See if any sample extraction or segment creation needs to be done with the available samples */
    //   this.processSamples(last)

    //   /* Inform about the best range to fetch next */
    //   if (this.nextSeekPosition) {
    //     nextFileStart = this.nextSeekPosition
    //     this.nextSeekPosition = undefined
    //   } else {
    //     nextFileStart = this.nextParsePosition
    //   }
    //   if (this.stream.getEndFilePositionAfter) {
    //     nextFileStart = this.stream.getEndFilePositionAfter(nextFileStart)
    //   }
    // } else {
    //   if (this.nextParsePosition) {
    //     /* moov has not been parsed but the first buffer was received,
    // 	   the next fetch should probably be the next box start */
    //     nextFileStart = this.nextParsePosition
    //   } else {
    //     /* No valid buffer has been parsed yet, we cannot know what to parse next */
    //     nextFileStart = 0
    //   }
    // }
    // if (this.sidx) {
    //   if (this.onSidx && !this.sidxSent) {
    //     this.onSidx(this.sidx)
    //     this.sidxSent = true
    //   }
    // }
    // if (this.meta) {
    //   if (this.flattenItemInfo && !this.itemListBuilt) {
    //     this.flattenItemInfo()
    //     this.itemListBuilt = true
    //   }
    //   if (this.processItems) {
    //     this.processItems(this.onItem)
    //   }
    // }

    // if (this.stream.cleanBuffers) {
    //   console.info(
    //     'ISOFile',
    //     'Done processing buffer (fileStart: ' +
    //       ab.fileStart +
    //       ') - next buffer to fetch should have a fileStart position of ' +
    //       nextFileStart
    //   )
    //   this.stream.logBufferLevel()
    //   this.stream.cleanBuffers()
    //   this.stream.logBufferLevel(true)
    //   console.info('ISOFile', 'Sample data size in memory: ' + this.getAllocatedSampleDataSize())
    // }
    // return nextFileStart
  };

  ISOFile.prototype.checkBuffer = function checkBuffer(ab) {
    if (ab === null || ab === undefined) {
      throw 'Buffer must be defined and non empty';
    }
    if (ab.fileStart === undefined) {
      throw 'Buffer must have a fileStart property';
    }
    if (ab.byteLength === 0) {
      console.warn('ISOFile', 'Ignoring empty buffer (fileStart: ' + ab.fileStart + ')');
      this.stream.logBufferLevel();
      return false;
    }
    console.info('ISOFile', 'Processing buffer (fileStart: ' + ab.fileStart + ')');

    /* mark the bytes in the buffer as not being used yet */
    ab.usedBytes = 0;
    this.stream.insertBuffer(ab);
    this.stream.logBufferLevel();

    if (!this.stream.initialized()) {
      console.warn('ISOFile', 'Not ready to start parsing');
      return false;
    }
    return true;
  };

  return ISOFile;
}();

/* keep mdat data */


ISOFile.prototype.discardMdatData = false;

exports.default = ISOFile;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DataStream2 = __webpack_require__(3);

var _DataStream3 = _interopRequireDefault(_DataStream2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiBufferStream = function (_DataStream) {
  _inherits(MultiBufferStream, _DataStream);

  function MultiBufferStream(buffer) {
    _classCallCheck(this, MultiBufferStream);

    // List of ArrayBuffers, with a fileStart property, sorted in fileStart order and non overlapping
    var _this = _possibleConstructorReturn(this, _DataStream.call(this, new ArrayBuffer(), 0, _DataStream3.default.BIG_ENDIAN));

    _this.buffers = [];
    _this.bufferIndex = -1;
    if (buffer) {
      _this.insertBuffer(buffer);
      _this.bufferIndex = 0;
    }
    return _this;
  }

  /**
   * Returns the current position in the file
   * @return {Number} the position in the file
   */


  MultiBufferStream.prototype.getPosition = function getPosition() {
    if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === null) {
      throw 'Error accessing position in the MultiBufferStream';
    }
    return this.buffers[this.bufferIndex].fileStart + this.position;
  };

  MultiBufferStream.prototype.getEndPosition = function getEndPosition() {
    if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === null) {
      throw 'Error accessing position in the MultiBufferStream';
    }
    return this.buffers[this.bufferIndex].fileStart + this.byteLength;
  };

  MultiBufferStream.prototype.findPosition = function findPosition(fromStart, filePosition, markAsUsed) {
    var i;
    var abuffer = null;
    var index = -1;

    /* find the buffer with the largest position smaller than the given position */
    if (fromStart === true) {
      /* the reposition can be in the past, we need to check from the beginning of the list of buffers */
      i = 0;
    } else {
      i = this.bufferIndex;
    }

    while (i < this.buffers.length) {
      abuffer = this.buffers[i];
      if (abuffer.fileStart <= filePosition) {
        index = i;
        if (markAsUsed) {
          if (abuffer.fileStart + abuffer.byteLength <= filePosition) {
            abuffer.usedBytes = abuffer.byteLength;
          } else {
            abuffer.usedBytes = filePosition - abuffer.fileStart;
          }
          this.logBufferLevel();
        }
      } else {
        break;
      }
      i++;
    }

    if (index !== -1) {
      abuffer = this.buffers[index];
      if (abuffer.fileStart + abuffer.byteLength >= filePosition) {
        console.debug("MultiBufferStream", "Found position in existing buffer #" + index);
        return index;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  };

  /**
   * Tries to seek to a given file position
   * if possible, repositions the parsing from there and returns true
   * if not possible, does not change anything and returns false
   * @param  {Number}  filePosition position in the file to seek to
   * @param  {Boolean} fromStart    indicates if the search should start from the current buffer (false)
   *                                or from the first buffer (true)
   * @param  {Boolean} markAsUsed   indicates if the bytes in between the current position and the seek position
   *                                should be marked as used for garbage collection
   * @return {Boolean}              true if the seek succeeded, false otherwise
   */


  MultiBufferStream.prototype.seek = function seek(filePosition, fromStart, markAsUsed) {
    var index;
    index = this.findPosition(fromStart, filePosition, markAsUsed);
    if (index !== -1) {
      this.buffer = this.buffers[index];
      this.bufferIndex = index;
      this.position = filePosition - this.buffer.fileStart;
      console.debug('MultiBufferStream', 'Repositioning parser at buffer position: ' + this.position);
      return true;
    } else {
      console.debug('MultiBufferStream', 'Position ' + filePosition + ' not found in buffered data');
      return false;
    }
  };

  MultiBufferStream.prototype.insertBuffer = function insertBuffer(ab) {
    var to_add = true;
    /* TODO: improve insertion if many buffers */
    for (var i = 0; i < this.buffers.length; i++) {
      var b = this.buffers[i];
      if (ab.fileStart <= b.fileStart) {
        /* the insertion position is found */
        if (ab.fileStart === b.fileStart) {
          /* The new buffer overlaps with an existing buffer */
          if (ab.byteLength > b.byteLength) {
            /* the new buffer is bigger than the existing one
               remove the existing buffer and try again to insert 
               the new buffer to check overlap with the next ones */
            this.buffers.splice(i, 1);
            i--;
            continue;
          } else {
            /* the new buffer is smaller than the existing one, just drop it */
            console.warn('MultiBufferStream', 'Buffer (fileStart: ' + ab.fileStart + ' - Length: ' + ab.byteLength + ') already appended, ignoring');
          }
        } else {
          /* The beginning of the new buffer is not overlapping with an existing buffer
             let's check the end of it */
          if (ab.fileStart + ab.byteLength <= b.fileStart) {
            /* no overlap, we can add it as is */
          } else {
            /* There is some overlap, cut the new buffer short, and add it*/
            ab = this.reduceBuffer(ab, 0, b.fileStart - ab.fileStart);
          }
          console.debug('MultiBufferStream', 'Appending new buffer (fileStart: ' + ab.fileStart + ' - Length: ' + ab.byteLength + ')');
          this.buffers.splice(i, 0, ab);
          /* if this new buffer is inserted in the first place in the list of the buffer, 
             and the DataStream is initialized, make it the buffer used for parsing */
          if (i === 0) {
            this.buffer = ab;
          }
        }
        to_add = false;
        break;
      } else if (ab.fileStart < b.fileStart + b.byteLength) {
        /* the new buffer overlaps its beginning with the end of the current buffer */
        var offset = b.fileStart + b.byteLength - ab.fileStart;
        var newLength = ab.byteLength - offset;
        if (newLength > 0) {
          /* the new buffer is bigger than the current overlap, drop the overlapping part and try again inserting the remaining buffer */
          ab = this.reduceBuffer(ab, offset, newLength);
        } else {
          /* the content of the new buffer is entirely contained in the existing buffer, drop it entirely */
          to_add = false;
          break;
        }
      }
    }
    /* if the buffer has not been added, we can add it at the end */
    if (to_add) {
      // console.debug(
      //   'MultiBufferStream',
      //   'Appending new buffer (fileStart: ' + ab.fileStart + ' - Length: ' + ab.byteLength + ')'
      // )
      this.buffers.push(ab);
      /* if this new buffer is inserted in the first place in the list of the buffer, 
         and the DataStream is initialized, make it the buffer used for parsing */
      if (i === 0) {
        this.buffer = ab;
      }
    }
  };

  MultiBufferStream.prototype.logBufferLevel = function logBufferLevel(info) {
    var i;
    var buffer;
    var used, total;
    var ranges = [];
    var range;
    var bufferedString = '';
    used = 0;
    total = 0;
    for (i = 0; i < this.buffers.length; i++) {
      buffer = this.buffers[i];
      if (i === 0) {
        range = {};
        ranges.push(range);
        range.start = buffer.fileStart;
        range.end = buffer.fileStart + buffer.byteLength;
        bufferedString += '[' + range.start + '-';
      } else if (range.end === buffer.fileStart) {
        range.end = buffer.fileStart + buffer.byteLength;
      } else {
        range = {};
        range.start = buffer.fileStart;
        bufferedString += ranges[ranges.length - 1].end - 1 + '], [' + range.start + '-';
        range.end = buffer.fileStart + buffer.byteLength;
        ranges.push(range);
      }
      used += buffer.usedBytes;
      total += buffer.byteLength;
    }
    if (ranges.length > 0) {
      bufferedString += range.end - 1 + ']';
    }
    // var log = info ? Log.info : Log.debug
    if (this.buffers.length === 0) {
      console.log('MultiBufferStream', 'No more buffer in memory');
    } else {
      console.log('MultiBufferStream', '' + this.buffers.length + ' stored buffer(s) (' + used + '/' + total + ' bytes), continuous ranges: ' + bufferedString);
    }
  };

  MultiBufferStream.prototype.initialized = function initialized() {
    var firstBuffer;
    if (this.bufferIndex > -1) {
      return true;
    } else if (this.buffers.length > 0) {
      firstBuffer = this.buffers[0];
      if (firstBuffer.fileStart === 0) {
        this.buffer = firstBuffer;
        this.bufferIndex = 0;
        console.debug('MultiBufferStream', 'Stream ready for parsing');
        return true;
      } else {
        console.warn('MultiBufferStream', 'The first buffer should have a fileStart of 0');
        this.logBufferLevel();
        return false;
      }
    } else {
      console.warn('MultiBufferStream', 'No buffer to start parsing from');
      this.logBufferLevel();
      return false;
    }
  };

  MultiBufferStream.prototype.cleanBuffers = function cleanBuffers() {
    var i;
    var buffer;
    for (i = 0; i < this.buffers.length; i++) {
      buffer = this.buffers[i];
      // if (buffer.usedBytes === buffer.byteLength) {
      // Log.debug("MultiBufferStream", "Removing buffer #"+i);
      this.buffers.splice(i, 1);
      i--;
      // }
    }
  };

  return MultiBufferStream;
}(_DataStream3.default);

exports.default = MultiBufferStream;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* 
   TODO: fix endianness for 24/64-bit fields
   TODO: check range/support for 64-bits numbers in JavaScript
*/
var MAX_SIZE = Math.pow(2, 32);

/**
  DataStream reads scalars, arrays and structs of data from an ArrayBuffer.
  It's like a file-like DataView on steroids.

  @param {ArrayBuffer} arrayBuffer ArrayBuffer to read from.
  @param {?Number} byteOffset Offset from arrayBuffer beginning for the DataStream.
  @param {?Boolean} endianness DataStream.BIG_ENDIAN or DataStream.LITTLE_ENDIAN (the default).
  */

var DataStream = function () {
  function DataStream(arrayBuffer, byteOffset, endianness) {
    _classCallCheck(this, DataStream);

    this._byteOffset = byteOffset || 0;
    if (arrayBuffer instanceof ArrayBuffer) {
      this.buffer = arrayBuffer;
    } else if ((typeof arrayBuffer === 'undefined' ? 'undefined' : _typeof(arrayBuffer)) == 'object') {
      this.dataView = arrayBuffer;
      if (byteOffset) {
        this._byteOffset += byteOffset;
      }
    } else {
      this.buffer = new ArrayBuffer(arrayBuffer || 0);
    }
    this.position = 0;
    this.endianness = endianness == null ? DataStream.LITTLE_ENDIAN : endianness;
  }

  DataStream.prototype.getPosition = function getPosition() {
    return this.position;
  };

  /**
  Internal function to resize the DataStream buffer when required.
  @param {number} extra Number of bytes to add to the buffer allocation.
  @return {null}
  */


  DataStream.prototype._realloc = function _realloc(extra) {
    if (!this._dynamicSize) {
      return;
    }
    var req = this._byteOffset + this.position + extra;
    var blen = this._buffer.byteLength;
    if (req <= blen) {
      if (req > this._byteLength) {
        this._byteLength = req;
      }
      return;
    }
    if (blen < 1) {
      blen = 1;
    }
    while (req > blen) {
      blen *= 2;
    }
    var buf = new ArrayBuffer(blen);
    var src = new Uint8Array(this._buffer);
    var dst = new Uint8Array(buf, 0, src.length);
    dst.set(src);
    this.buffer = buf;
    this._byteLength = req;
  };

  /**
  Internal function to trim the DataStream buffer when required.
  Used for stripping out the extra bytes from the backing buffer when
  the virtual byteLength is smaller than the buffer byteLength (happens after
  growing the buffer with writes and not filling the extra space completely).
   @return {null}
  */


  DataStream.prototype._trimAlloc = function _trimAlloc() {
    if (this._byteLength == this._buffer.byteLength) {
      return;
    }
    var buf = new ArrayBuffer(this._byteLength);
    var dst = new Uint8Array(buf);
    var src = new Uint8Array(this._buffer, 0, dst.length);
    dst.set(src);
    this.buffer = buf;
  };

  /**
  Sets the DataStream read/write position to given position.
  Clamps between 0 and DataStream length.
   @param {number} pos Position to seek to.
  @return {null}
  */


  DataStream.prototype.seek = function seek(pos) {
    var npos = Math.max(0, Math.min(this.byteLength, pos));
    this.position = isNaN(npos) || !isFinite(npos) ? 0 : npos;
  };

  /**
  Returns true if the DataStream seek pointer is at the end of buffer and
  there's no more data to read.
   @return {boolean} True if the seek pointer is at the end of the buffer.
  */


  DataStream.prototype.isEof = function isEof() {
    return this.position >= this._byteLength;
  };

  /**
  Maps a Uint8Array into the DataStream buffer.
   Nice for quickly reading in data.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} Uint8Array to the DataStream backing buffer.
  */


  DataStream.prototype.mapUint8Array = function mapUint8Array(length) {
    this._realloc(length * 1);
    var arr = new Uint8Array(this._buffer, this.byteOffset + this.position, length);
    this.position += length * 1;
    return arr;
  };

  /**
  Reads an Int32Array of desired length and endianness from the DataStream.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Int32Array.
  */


  DataStream.prototype.readInt32Array = function readInt32Array(length, e) {
    length = length == null ? this.byteLength - this.position / 4 : length;
    var arr = new Int32Array(length);
    DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
    DataStream.arrayToNative(arr, e == null ? this.endianness : e);
    this.position += arr.byteLength;
    return arr;
  };

  /**
  Reads an Int16Array of desired length and endianness from the DataStream.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Int16Array.
  */


  DataStream.prototype.readInt16Array = function readInt16Array(length, e) {
    length = length == null ? this.byteLength - this.position / 2 : length;
    var arr = new Int16Array(length);
    DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
    DataStream.arrayToNative(arr, e == null ? this.endianness : e);
    this.position += arr.byteLength;
    return arr;
  };

  /**
  Reads an Int8Array of desired length from the DataStream.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Int8Array.
  */


  DataStream.prototype.readInt8Array = function readInt8Array(length) {
    length = length == null ? this.byteLength - this.position : length;
    var arr = new Int8Array(length);
    DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
    this.position += arr.byteLength;
    return arr;
  };

  /**
  Reads a Uint32Array of desired length and endianness from the DataStream.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Uint32Array.
  */


  DataStream.prototype.readUint32Array = function readUint32Array(length, e) {
    length = length == null ? this.byteLength - this.position / 4 : length;
    var arr = new Uint32Array(length);
    DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
    DataStream.arrayToNative(arr, e == null ? this.endianness : e);
    this.position += arr.byteLength;
    return arr;
  };

  /**
  Reads a Uint16Array of desired length and endianness from the DataStream.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Uint16Array.
  */


  DataStream.prototype.readUint16Array = function readUint16Array(length, e) {
    length = length == null ? this.byteLength - this.position / 2 : length;
    var arr = new Uint16Array(length);
    DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
    DataStream.arrayToNative(arr, e == null ? this.endianness : e);
    this.position += arr.byteLength;
    return arr;
  };

  /**
  Reads a Uint8Array of desired length from the DataStream.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Uint8Array.
  */


  DataStream.prototype.readUint8Array = function readUint8Array(length) {
    length = length == null ? this.byteLength - this.position : length;
    var arr = new Uint8Array(length);
    DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
    this.position += arr.byteLength;
    return arr;
  };

  /**
  Reads a Float64Array of desired length and endianness from the DataStream.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Float64Array.
  */


  DataStream.prototype.readFloat64Array = function readFloat64Array(length, e) {
    length = length == null ? this.byteLength - this.position / 8 : length;
    var arr = new Float64Array(length);
    DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
    DataStream.arrayToNative(arr, e == null ? this.endianness : e);
    this.position += arr.byteLength;
    return arr;
  };

  /**
  Reads a Float32Array of desired length and endianness from the DataStream.
   @param {number} length Number of elements to map.
  @param {?boolean} e Endianness of the data to read.
  @return {Object} The read Float32Array.
  */


  DataStream.prototype.readFloat32Array = function readFloat32Array(length, e) {
    length = length == null ? this.byteLength - this.position / 4 : length;
    var arr = new Float32Array(length);
    DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
    DataStream.arrayToNative(arr, e == null ? this.endianness : e);
    this.position += arr.byteLength;
    return arr;
  };

  /**
  Reads a 32-bit int from the DataStream with the desired endianness.
   @param {?boolean} e Endianness of the number.
  @return {number} The read number.
  */


  DataStream.prototype.readInt32 = function readInt32(e) {
    var v = this._dataView.getInt32(this.position, e == null ? this.endianness : e);
    this.position += 4;
    return v;
  };

  /**
  Reads a 16-bit int from the DataStream with the desired endianness.
   @param {?boolean} e Endianness of the number.
  @return {number} The read number.
  */


  DataStream.prototype.readInt16 = function readInt16(e) {
    var v = this._dataView.getInt16(this.position, e == null ? this.endianness : e);
    this.position += 2;
    return v;
  };

  /**
  Reads an 8-bit int from the DataStream.
   @return {number} The read number.
  */


  DataStream.prototype.readInt8 = function readInt8() {
    var v = this._dataView.getInt8(this.position);
    this.position += 1;
    return v;
  };

  /**
  Reads a 32-bit unsigned int from the DataStream with the desired endianness.
   @param {?boolean} e Endianness of the number.
  @return {number} The read number.
  */


  DataStream.prototype.readUint32 = function readUint32(e) {
    var v = this._dataView.getUint32(this.position, e == null ? this.endianness : e);
    this.position += 4;
    return v;
  };

  /**
  Reads a 16-bit unsigned int from the DataStream with the desired endianness.
   @param {?boolean} e Endianness of the number.
  @return {number} The read number.
  */


  DataStream.prototype.readUint16 = function readUint16(e) {
    var v = this._dataView.getUint16(this.position, e == null ? this.endianness : e);
    this.position += 2;
    return v;
  };

  /**
  Reads an 8-bit unsigned int from the DataStream.
   @return {number} The read number.
  */


  DataStream.prototype.readUint8 = function readUint8() {
    var v = this._dataView.getUint8(this.position);
    this.position += 1;
    return v;
  };

  /**
  Reads a 32-bit float from the DataStream with the desired endianness.
   @param {?boolean} e Endianness of the number.
  @return {number} The read number.
  */


  DataStream.prototype.readFloat32 = function readFloat32(e) {
    var v = this._dataView.getFloat32(this.position, e == null ? this.endianness : e);
    this.position += 4;
    return v;
  };

  /**
  Reads a 64-bit float from the DataStream with the desired endianness.
   @param {?boolean} e Endianness of the number.
  @return {number} The read number.
  */


  DataStream.prototype.readFloat64 = function readFloat64(e) {
    var v = this._dataView.getFloat64(this.position, e == null ? this.endianness : e);
    this.position += 8;
    return v;
  };

  return DataStream;
}();

// if (typeof exports !== 'undefined') {
//   exports.DataStream = DataStream;
// }

/**
  Big-endian const to use as default endianness.
  @type {boolean}
  */


DataStream.prototype.BIG_ENDIAN = false;

/**
    Little-endian const to use as default endianness.
    @type {boolean}
    */
DataStream.prototype.LITTLE_ENDIAN = true;

/**
    Virtual byte length of the DataStream backing buffer.
    Updated to be max of original buffer size and last written size.
    If dynamicSize is false is set to buffer size.
    @type {number}
    */
DataStream.prototype._byteLength = 0;

/**
  Returns the byte length of the DataStream object.
  @type {number}
  */
Object.defineProperty(DataStream.prototype, 'byteLength', {
  get: function get() {
    return this._byteLength - this._byteOffset;
  }
});

/**
Set/get the backing ArrayBuffer of the DataStream object.
The setter updates the DataView to point to the new buffer.
@type {Object}
*/
Object.defineProperty(DataStream.prototype, 'buffer', {
  get: function get() {
    this._trimAlloc();
    return this._buffer;
  },
  set: function set(v) {
    this._buffer = v;
    this._dataView = new DataView(this._buffer, this._byteOffset);
    this._byteLength = this._buffer.byteLength;
  }
});

/**
Set/get the byteOffset of the DataStream object.
The setter updates the DataView to point to the new byteOffset.
@type {number}
*/
Object.defineProperty(DataStream.prototype, 'byteOffset', {
  get: function get() {
    return this._byteOffset;
  },
  set: function set(v) {
    this._byteOffset = v;
    this._dataView = new DataView(this._buffer, this._byteOffset);
    this._byteLength = this._buffer.byteLength;
  }
});

/**
Set/get the backing DataView of the DataStream object.
The setter updates the buffer and byteOffset to point to the DataView values.
@type {Object}
*/
Object.defineProperty(DataStream.prototype, 'dataView', {
  get: function get() {
    return this._dataView;
  },
  set: function set(v) {
    this._byteOffset = v.byteOffset;
    this._buffer = v.buffer;
    this._dataView = new DataView(this._buffer, this._byteOffset);
    this._byteLength = this._byteOffset + v.byteLength;
  }
});

/**
  Seek position where DataStream#readStruct ran into a problem.
  Useful for debugging struct parsing.

  @type {number}
 */
DataStream.prototype.failurePosition = 0;

String.fromCharCodeUint8 = function (uint8arr) {
  var arr = [];
  for (var i = 0; i < uint8arr.length; i++) {
    arr[i] = uint8arr[i];
  }
  return String.fromCharCode.apply(null, arr);
};

/**
  Native endianness. Either DataStream.BIG_ENDIAN or DataStream.LITTLE_ENDIAN
  depending on the platform endianness.

  @type {boolean}
 */
DataStream.endianness = new Int8Array(new Int16Array([1]).buffer)[0] > 0;

/**
  Copies byteLength bytes from the src buffer at srcOffset to the
  dst buffer at dstOffset.

  @param {Object} dst Destination ArrayBuffer to write to.
  @param {number} dstOffset Offset to the destination ArrayBuffer.
  @param {Object} src Source ArrayBuffer to read from.
  @param {number} srcOffset Offset to the source ArrayBuffer.
  @param {number} byteLength Number of bytes to copy.
 */
DataStream.memcpy = function (dst, dstOffset, src, srcOffset, byteLength) {
  var dstU8 = new Uint8Array(dst, dstOffset, byteLength);
  var srcU8 = new Uint8Array(src, srcOffset, byteLength);
  dstU8.set(srcU8);
};

/**
    Converts array to native endianness in-place.
  
    @param {Object} array Typed array to convert.
    @param {boolean} arrayIsLittleEndian True if the data in the array is
                                         little-endian. Set false for big-endian.
    @return {Object} The converted typed array.
   */
DataStream.arrayToNative = function (array, arrayIsLittleEndian) {
  if (arrayIsLittleEndian == this.endianness) {
    return array;
  } else {
    return this.flipArrayEndianness(array);
  }
};

/**
    Converts native endianness array to desired endianness in-place.
  
    @param {Object} array Typed array to convert.
    @param {boolean} littleEndian True if the converted array should be
                                  little-endian. Set false for big-endian.
    @return {Object} The converted typed array.
   */
DataStream.nativeToEndian = function (array, littleEndian) {
  if (this.endianness == littleEndian) {
    return array;
  } else {
    return this.flipArrayEndianness(array);
  }
};

/**
    Flips typed array endianness in-place.
  
    @param {Object} array Typed array to flip.
    @return {Object} The converted typed array.
   */
DataStream.flipArrayEndianness = function (array) {
  var u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
  for (var i = 0; i < array.byteLength; i += array.BYTES_PER_ELEMENT) {
    for (var j = i + array.BYTES_PER_ELEMENT - 1, k = i; j > k; j--, k++) {
      var tmp = u8[k];
      u8[k] = u8[j];
      u8[j] = tmp;
    }
  }
  return array;
};

/**
  Read a string of desired length and encoding from the DataStream.

  @param {number} length The length of the string to read in bytes.
  @param {?string} encoding The encoding of the string data in the DataStream.
                            Defaults to ASCII.
  @return {string} The read string.
 */
DataStream.prototype.readString = function (length, encoding) {
  if (encoding == null || encoding == 'ASCII') {
    return String.fromCharCodeUint8.apply(null, [this.mapUint8Array(length == null ? this.byteLength - this.position : length)]);
  } else {
    return new TextDecoder(encoding).decode(this.mapUint8Array(length));
  }
};

/**
  Read null-terminated string of desired length from the DataStream. Truncates
  the returned string so that the null byte is not a part of it.

  @param {?number} length The length of the string to read.
  @return {string} The read string.
 */
DataStream.prototype.readCString = function (length) {
  var blen = this.byteLength - this.position;
  var u8 = new Uint8Array(this._buffer, this._byteOffset + this.position);
  var len = blen;
  if (length != null) {
    len = Math.min(length, blen);
  }
  for (var i = 0; i < len && u8[i] !== 0; i++) {} // find first zero byte
  var s = String.fromCharCodeUint8.apply(null, [this.mapUint8Array(i)]);
  if (length != null) {
    this.position += len - i;
  } else if (i != blen) {
    this.position += 1; // trailing zero if not at end of buffer
  }
  return s;
};

DataStream.prototype.readInt64 = function () {
  return this.readInt32() * MAX_SIZE + this.readUint32();
};
DataStream.prototype.readUint64 = function () {
  return this.readUint32() * MAX_SIZE + this.readUint32();
};

DataStream.prototype.readInt64 = function () {
  return this.readUint32() * MAX_SIZE + this.readUint32();
};

DataStream.prototype.readUint24 = function () {
  return (this.readUint8() << 16) + (this.readUint8() << 8) + this.readUint8();
};

exports.default = DataStream;
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoxParser = function BoxParser(stream, callback) {
  _classCallCheck(this, BoxParser);
};

BoxParser.ERR_INVALID_DATA = -1;
BoxParser.ERR_NOT_ENOUGH_DATA = 0;
BoxParser.OK = 1;

// Boxes to be created with default parsing
BoxParser.BASIC_BOXES = ["mdat", "idat", "free", "skip", "meco", "strk"];
BoxParser.FULL_BOXES = ["hmhd", "nmhd", "iods", "xml ", "bxml", "ipro", "mere"];
BoxParser.CONTAINER_BOXES = [["moov", ["trak", "pssh"]], ["trak"], ["edts"], ["mdia"], ["minf"], ["dinf"], ["stbl", ["sgpd", "sbgp"]], ["mvex", ["trex"]], ["moof", ["traf"]], ["traf", ["trun", "sgpd", "sbgp"]], ["vttc"], ["tref"], ["iref"], ["mfra", ["tfra"]], ["meco"], ["hnti"], ["hinf"], ["strk"], ["strd"], ["sinf"], ["rinf"], ["schi"], ["trgr"], ["udta", ["kind"]], ["iprp", ["ipma"]], ["ipco"]];
// Boxes effectively created
BoxParser.boxCodes = [];
BoxParser.fullBoxCodes = [];
BoxParser.containerBoxCodes = [];
BoxParser.sampleEntryCodes = {}, BoxParser.sampleGroupEntryCodes = [];
BoxParser.trackGroupTypes = [];
BoxParser.UUIDBoxes = {};
BoxParser.UUIDs = [];
BoxParser.initialize = function () {
  BoxParser.FullBox.prototype = new BoxParser.Box();
  BoxParser.ContainerBox.prototype = new BoxParser.Box();
  BoxParser.SampleEntry.prototype = new BoxParser.Box();
  BoxParser.TrackGroupTypeBox.prototype = new BoxParser.FullBox();

  /* creating constructors for simple boxes */
  BoxParser.BASIC_BOXES.forEach(function (type) {
    BoxParser.createBoxCtor(type);
  });
  BoxParser.FULL_BOXES.forEach(function (type) {
    BoxParser.createFullBoxCtor(type);
  });
  BoxParser.CONTAINER_BOXES.forEach(function (types) {
    BoxParser.createContainerBoxCtor(types[0], null, types[1]);
  });
};
BoxParser.Box = function (_type, _size, _uuid) {
  this.type = _type;
  this.size = _size;
  this.uuid = _uuid;
};
BoxParser.FullBox = function (type, size, uuid) {
  BoxParser.Box.call(this, type, size, uuid);
  this.flags = 0;
  this.version = 0;
};
BoxParser.ContainerBox = function (type, size, uuid) {
  BoxParser.Box.call(this, type, size, uuid);
  this.boxes = [];
};
BoxParser.SampleEntry = function (type, size, hdr_size, start) {
  BoxParser.ContainerBox.call(this, type, size);
  this.hdr_size = hdr_size;
  this.start = start;
};
BoxParser.SampleGroupEntry = function (type) {
  this.grouping_type = type;
};
BoxParser.TrackGroupTypeBox = function (type, size) {
  BoxParser.FullBox.call(this, type, size);
};
BoxParser.createBoxCtor = function (type, parseMethod) {
  BoxParser.boxCodes.push(type);
  BoxParser[type + "Box"] = function (size) {
    BoxParser.Box.call(this, type, size);
  };
  BoxParser[type + "Box"].prototype = new BoxParser.Box();
  if (parseMethod) BoxParser[type + "Box"].prototype.parse = parseMethod;
};
BoxParser.createFullBoxCtor = function (type, parseMethod) {
  //BoxParser.fullBoxCodes.push(type);
  BoxParser[type + "Box"] = function (size) {
    BoxParser.FullBox.call(this, type, size);
  };
  BoxParser[type + "Box"].prototype = new BoxParser.FullBox();
  BoxParser[type + "Box"].prototype.parse = function (stream) {
    this.parseFullHeader(stream);
    if (parseMethod) {
      parseMethod.call(this, stream);
    }
  };
};
BoxParser.addSubBoxArrays = function (subBoxNames) {
  if (subBoxNames) {
    this.subBoxNames = subBoxNames;
    var nbSubBoxes = subBoxNames.length;
    for (var k = 0; k < nbSubBoxes; k++) {
      this[subBoxNames[k] + "s"] = [];
    }
  }
};
BoxParser.createContainerBoxCtor = function (type, parseMethod, subBoxNames) {
  //BoxParser.containerBoxCodes.push(type);
  BoxParser[type + "Box"] = function (size) {
    BoxParser.ContainerBox.call(this, type, size);
    BoxParser.addSubBoxArrays.call(this, subBoxNames);
  };
  BoxParser[type + "Box"].prototype = new BoxParser.ContainerBox();
  if (parseMethod) BoxParser[type + "Box"].prototype.parse = parseMethod;
};
BoxParser.createMediaSampleEntryCtor = function (mediaType, parseMethod, subBoxNames) {
  BoxParser.sampleEntryCodes[mediaType] = [];
  BoxParser[mediaType + "SampleEntry"] = function (type, size) {
    BoxParser.SampleEntry.call(this, type, size);
    BoxParser.addSubBoxArrays.call(this, subBoxNames);
  };
  BoxParser[mediaType + "SampleEntry"].prototype = new BoxParser.SampleEntry();
  if (parseMethod) BoxParser[mediaType + "SampleEntry"].prototype.parse = parseMethod;
};
BoxParser.createSampleEntryCtor = function (mediaType, type, parseMethod, subBoxNames) {
  BoxParser.sampleEntryCodes[mediaType].push(type);
  BoxParser[type + "SampleEntry"] = function (size) {
    BoxParser[mediaType + "SampleEntry"].call(this, type, size);
    BoxParser.addSubBoxArrays.call(this, subBoxNames);
  };
  BoxParser[type + "SampleEntry"].prototype = new BoxParser[mediaType + "SampleEntry"]();
  if (parseMethod) BoxParser[type + "SampleEntry"].prototype.parse = parseMethod;
};
BoxParser.createEncryptedSampleEntryCtor = function (mediaType, type, parseMethod) {
  BoxParser.createSampleEntryCtor.call(this, mediaType, type, parseMethod, ["sinf"]);
};
BoxParser.createSampleGroupCtor = function (type, parseMethod) {
  //BoxParser.sampleGroupEntryCodes.push(type);
  BoxParser[type + "SampleGroupEntry"] = function (size) {
    BoxParser.SampleGroupEntry.call(this, type, size);
  };
  BoxParser[type + "SampleGroupEntry"].prototype = new BoxParser.SampleGroupEntry();
  if (parseMethod) BoxParser[type + "SampleGroupEntry"].prototype.parse = parseMethod;
};
BoxParser.createTrackGroupCtor = function (type, parseMethod) {
  //BoxParser.trackGroupTypes.push(type);
  BoxParser[type + "TrackGroupTypeBox"] = function (size) {
    BoxParser.TrackGroupTypeBox.call(this, type, size);
  };
  BoxParser[type + "TrackGroupTypeBox"].prototype = new BoxParser.TrackGroupTypeBox();
  if (parseMethod) BoxParser[type + "TrackGroupTypeBox"].prototype.parse = parseMethod;
};
BoxParser.createUUIDBox = function (uuid, isFullBox, isContainerBox, parseMethod) {
  BoxParser.UUIDs.push(uuid);
  BoxParser.UUIDBoxes[uuid] = function (size) {
    if (isFullBox) {
      BoxParser.FullBox.call(this, "uuid", size, uuid);
    } else {
      if (isContainerBox) {
        BoxParser.ContainerBox.call(this, "uuid", size, uuid);
      } else {
        BoxParser.Box.call(this, "uuid", size, uuid);
      }
    }
  };
  BoxParser.UUIDBoxes[uuid].prototype = isFullBox ? new BoxParser.FullBox() : isContainerBox ? new BoxParser.ContainerBox() : new BoxParser.Box();
  if (parseMethod) {
    if (isFullBox) {
      BoxParser.UUIDBoxes[uuid].prototype.parse = function (stream) {
        this.parseFullHeader(stream);
        if (parseMethod) {
          parseMethod.call(this, stream);
        }
      };
    } else {
      BoxParser.UUIDBoxes[uuid].prototype.parse = parseMethod;
    }
  }
};

BoxParser.initialize();

BoxParser.parseOneBox = function (stream, headerOnly, parentSize) {
  var box;
  var start = stream.getPosition();
  var hdr_size = 0;
  var diff;
  var uuid;
  if (stream.getEndPosition() - start < 8) {
    console.log('BoxParser', 'Not enough data in stream to parse the type and size of the box');
    return { code: BoxParser.ERR_NOT_ENOUGH_DATA };
  }
  if (parentSize && parentSize < 8) {
    console.log('BoxParser', 'Not enough bytes left in the parent box to parse a new box');
    return { code: BoxParser.ERR_NOT_ENOUGH_DATA };
  }
  var size = stream.readUint32();
  var type = stream.readString(4);
  var box_type = type;
  // console.log(
  //   'BoxParser',
  //   "Found box of type '" + type + "' and size " + size + ' at position ' + start
  // )
  hdr_size = 8;
  if (type == 'uuid') {
    if (stream.getEndPosition() - stream.getPosition() < 16 || parentSize - hdr_size < 16) {
      stream.seek(start);
      console.log('BoxParser', 'Not enough bytes left in the parent box to parse a UUID box');
      return { code: BoxParser.ERR_NOT_ENOUGH_DATA };
    }
    uuid = BoxParser.parseUUID(stream);
    hdr_size += 16;
    box_type = uuid;
  }
  if (size == 1) {
    if (stream.getEndPosition() - stream.getPosition() < 8 || parentSize && parentSize - hdr_size < 8) {
      stream.seek(start);
      console.warn('BoxParser', 'Not enough data in stream to parse the extended size of the "' + type + '" box');
      return { code: BoxParser.ERR_NOT_ENOUGH_DATA };
    }
    size = stream.readUint64();
    hdr_size += 8;
  } else if (size === 0) {
    /* box extends till the end of file or invalid file */
    if (parentSize) {
      size = parentSize;
    } else {
      /* box extends till the end of file */
      if (type !== 'mdat') {
        console.error('BoxParser', "Unlimited box size not supported for type= '" + type + "'");
        box = new BoxParser.Box(type, size);
        return { code: BoxParser.OK, box: box, size: box.size };
      }
    }
  }
  if (size < hdr_size) {
    console.error('BoxParser', 'Box of type ' + type + ' has an invalid size ' + size + ' (too small to be a box)');
    return {
      code: BoxParser.ERR_NOT_ENOUGH_DATA,
      type: type,
      size: size,
      hdr_size: hdr_size,
      start: start
    };
  }
  if (parentSize && size > parentSize) {
    console.error('BoxParser', "Box of type '" + type + "' has a size " + size + ' greater than its container size ' + parentSize);
    return {
      code: BoxParser.ERR_NOT_ENOUGH_DATA,
      type: type,
      size: size,
      hdr_size: hdr_size,
      start: start
    };
  }
  if (start + size > stream.getEndPosition()) {
    stream.seek(start);
    console.info('BoxParser', "Not enough data in stream to parse the entire '" + type + "' box");
    return {
      code: BoxParser.ERR_NOT_ENOUGH_DATA,
      type: type,
      size: size,
      hdr_size: hdr_size,
      start: start
    };
  }
  if (headerOnly || true) {
    var parseBoxs = ['moov', 'trak', 'tkhd', 'moof', 'traf', 'tfhd', 'meta', 'xml '];
    if (parseBoxs.includes(type)) {
      box = new BoxParser[type + 'Box'](size);
      box.hdr_size = hdr_size;
      /* recording the position of the box in the input stream */
      box.start = start;

      if (type === "xml ") {
        // box.hdr_size = hdr_size
        // /* recording the position of the box in the input stream */
        // box.start = start
        // if (box.write === BoxParser.Box.prototype.write && box.type !== 'mdat') {
        console.info('BoxParser', "'" + box_type + "' box writing not yet implemented, keeping unparsed data in memory for later write");
        box.parseDataAndRewind(stream);
        // }
        // box.parse(stream)
        // diff = stream.getPosition() - (box.start + box.size)
      }

      box.parse(stream);
    }

    stream.position = start + size;
    return { code: BoxParser.OK, type: type, size: size, hdr_size: hdr_size, start: start, box: box };
  } else {
    if (BoxParser[type + 'Box']) {
      box = new BoxParser[type + 'Box'](size);
    } else {
      if (type !== 'uuid') {
        console.warn('BoxParser', "Unknown box type= '" + type + "'");
        box = new BoxParser.Box(type, size);
        box.has_unparsed_data = true;
      } else {
        if (BoxParser.UUIDBoxes[uuid]) {
          box = new BoxParser.UUIDBoxes[uuid](size);
        } else {
          console.warn('BoxParser', "Unknown uuid type= '" + uuid + "'");
          box = new BoxParser.Box(type, size);
          box.uuid = uuid;
          box.has_unparsed_data = true;
        }
      }
    }
  }
  box.hdr_size = hdr_size;
  /* recording the position of the box in the input stream */
  box.start = start;
  if (box.write === BoxParser.Box.prototype.write && box.type !== 'mdat') {
    console.info('BoxParser', "'" + box_type + "' box writing not yet implemented, keeping unparsed data in memory for later write");
    box.parseDataAndRewind(stream);
  }
  box.parse(stream);
  diff = stream.getPosition() - (box.start + box.size);
  if (diff < 0) {
    console.warn('BoxParser', "Parsing of box '" + box_type + "' did not read the entire indicated box data size (missing " + -diff + ' bytes), seeking forward');
    stream.seek(box.start + box.size);
  } else if (diff > 0) {
    console.error('BoxParser', "Parsing of box '" + box_type + "' read " + diff + ' more bytes than the indicated box data size, seeking backwards');
    stream.seek(box.start + box.size);
  }
  return { code: BoxParser.OK, box: box, size: box.size };
};

BoxParser.ContainerBox.prototype.parse = function (stream) {
  var ret;
  var box;
  while (stream.getPosition() < this.start + this.size) {
    ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
    // let saveDetailInfoBoxs = ['trak']
    // if(saveDetailInfoBoxs.includes(ret.type)){
    // 	this[this.subBoxNames[this.subBoxNames.indexOf(ret.type)]+"s"].push(ret);
    // }
    if (ret.box && ret.code === BoxParser.OK) {
      box = ret.box;
      /* store the box in the 'boxes' array to preserve box order (for offset) but also store box in a property for more direct access */
      this.boxes.push(box);
      if (this.subBoxNames && this.subBoxNames.indexOf(box.type) != -1) {
        this[this.subBoxNames[this.subBoxNames.indexOf(box.type)] + "s"].push(box);
      } else {
        var box_type = box.type !== "uuid" ? box.type : box.uuid;
        if (this[box_type]) {
          console.warn("Box of type " + box_type + " already stored in field of this type");
        } else {
          this[box_type] = box;
        }
      }
    }
    // else {
    // 	return;
    // }
  }
};

// import "./parse/index"
// ===========================
//                  type
// ===============================
BoxParser.createBoxCtor("ftyp", function (stream) {
  var toparse = this.size - this.hdr_size;
  this.major_brand = stream.readString(4);
  this.minor_version = stream.readUint32();
  toparse -= 8;
  this.compatible_brands = [];
  var i = 0;
  while (toparse >= 4) {
    this.compatible_brands[i] = stream.readString(4);
    toparse -= 4;
    i++;
  }
});

BoxParser.createFullBoxCtor("mfhd", function (stream) {
  this.sequence_number = stream.readUint32();
});

BoxParser.createFullBoxCtor("sdtp", function (stream) {
  var tmp_byte;
  var count = this.size - this.hdr_size;
  this.is_leading = [];
  this.sample_depends_on = [];
  this.sample_is_depended_on = [];
  this.sample_has_redundancy = [];
  for (var i = 0; i < count; i++) {
    tmp_byte = stream.readUint8();
    this.is_leading[i] = tmp_byte >> 6;
    this.sample_depends_on[i] = tmp_byte >> 4 & 0x3;
    this.sample_is_depended_on[i] = tmp_byte >> 2 & 0x3;
    this.sample_has_redundancy[i] = tmp_byte & 0x3;
  }
});

BoxParser.createFullBoxCtor("tfdt", function (stream) {
  if (this.version == 1) {
    this.baseMediaDecodeTime = stream.readUint64();
  } else {
    this.baseMediaDecodeTime = stream.readUint32();
  }
});

BoxParser.createFullBoxCtor("tfhd", function (stream) {
  var readBytes = 0;
  this.track_id = stream.readUint32();
  if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET) {
    this.base_data_offset = stream.readUint64();
    readBytes += 8;
  } else {
    this.base_data_offset = 0;
  }
  if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
    this.default_sample_description_index = stream.readUint32();
    readBytes += 4;
  } else {
    this.default_sample_description_index = 0;
  }
  if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
    this.default_sample_duration = stream.readUint32();
    readBytes += 4;
  } else {
    this.default_sample_duration = 0;
  }
  if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
    this.default_sample_size = stream.readUint32();
    readBytes += 4;
  } else {
    this.default_sample_size = 0;
  }
  if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
    this.default_sample_flags = stream.readUint32();
    readBytes += 4;
  } else {
    this.default_sample_flags = 0;
  }
});

BoxParser.createFullBoxCtor("trun", function (stream) {
  var readBytes = 0;
  this.sample_count = stream.readUint32();
  readBytes += 4;
  if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET) {
    this.data_offset = stream.readInt32(); //signed
    readBytes += 4;
  } else {
    this.data_offset = 0;
  }
  if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
    this.first_sample_flags = stream.readUint32();
    readBytes += 4;
  } else {
    this.first_sample_flags = 0;
  }
  this.sample_duration = [];
  this.sample_size = [];
  this.sample_flags = [];
  this.sample_composition_time_offset = [];
  if (this.size - this.hdr_size > readBytes) {
    for (var i = 0; i < this.sample_count; i++) {
      if (this.flags & BoxParser.TRUN_FLAGS_DURATION) {
        this.sample_duration[i] = stream.readUint32();
      }
      if (this.flags & BoxParser.TRUN_FLAGS_SIZE) {
        this.sample_size[i] = stream.readUint32();
      }
      if (this.flags & BoxParser.TRUN_FLAGS_FLAGS) {
        this.sample_flags[i] = stream.readUint32();
      }
      if (this.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
        if (this.version === 0) {
          this.sample_composition_time_offset[i] = stream.readUint32();
        } else {
          this.sample_composition_time_offset[i] = stream.readInt32(); //signed
        }
      }
    }
  }
});

BoxParser.createFullBoxCtor("tkhd", function (stream) {
  if (this.version == 1) {
    this.creation_time = stream.readUint64();
    this.modification_time = stream.readUint64();
    this.track_id = stream.readUint32();
    stream.readUint32();
    this.duration = stream.readUint64();
  } else {
    this.creation_time = stream.readUint32();
    this.modification_time = stream.readUint32();
    this.track_id = stream.readUint32();
    stream.readUint32();
    this.duration = stream.readUint32();
  }
  stream.readUint32Array(2);
  this.layer = stream.readInt16();
  this.alternate_group = stream.readInt16();
  this.volume = stream.readInt16() >> 8;
  stream.readUint16();
  this.matrix = stream.readInt32Array(9);
  this.width = stream.readUint32();
  this.height = stream.readUint32();
});

BoxParser.FullBox.prototype.parseFullHeader = function (stream) {
  this.version = stream.readUint8();
  this.flags = stream.readUint24();
  this.hdr_size += 4;
};

BoxParser.createFullBoxCtor("meta", function (stream) {
  this.boxes = [];
  BoxParser.ContainerBox.prototype.parse.call(this, stream);
});

/* Used to parse a box without consuming its data, to allow detailled parsing
   Useful for boxes for which a write method is not yet implemented */
BoxParser.Box.prototype.parseDataAndRewind = function (stream) {
  this.data = stream.readUint8Array(this.size - this.hdr_size);
  // rewinding
  stream.position -= this.size - this.hdr_size;
};

BoxParser.FullBox.prototype.parseDataAndRewind = function (stream) {
  this.parseFullHeader(stream);
  this.data = stream.readUint8Array(this.size - this.hdr_size);
  // restore the header size as if the full header had not been parsed
  this.hdr_size -= 4;
  // rewinding
  stream.position -= this.size - this.hdr_size;
};

exports.default = BoxParser;
module.exports = exports["default"];

/***/ })
/******/ ]);
});