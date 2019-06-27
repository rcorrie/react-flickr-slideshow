"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _enzymeAdapterReact = _interopRequireDefault(require("enzyme-adapter-react-16"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _flickrSlideshow = _interopRequireDefault(require("./flickr-slideshow"));

var Helpers = _interopRequireWildcard(require("./helpers"));

(0, _enzyme.configure)({
  adapter: new _enzymeAdapterReact.default()
});
describe('Helpers', function () {
  describe('Method: supplantStr', function () {
    it('should properly interpolate a string with provided map', function () {
      var string = 'Lorem {a} dolor {b} amet {b} {c} {a}';
      var map = {
        a: 'ipsum',
        b: 'SET',
        c: 123
      };
      var result = Helpers.supplantStr(string, map);
      var expectedResult = 'Lorem ipsum dolor SET amet SET 123 ipsum';
      expect(result).toEqual(expectedResult);
    });
    describe('onError', function () {
      it('should return provided string', function () {
        var string = 'Lorem {a} dolor {b} amet {b} {c} {a}';
        var map = null;
        var result = Helpers.supplantStr(string, map);
        expect(result).toEqual(string);
      });
    });
  });
  describe('Method: randomNumber', function () {
    it('should return a random number between the range provided', function () {
      var min = 8;
      var max = 9;
      var result = Helpers.randomNumber(min, max);
      var expectedResult = result === 8 || result === 9;
      expect(expectedResult).toBe(true);
    });
  });
});
describe('FlickrSlideshow Component', function () {
  /*
   * Set up our app constants
   */
  var DEFAULT_SLIDESHOW_INTERVAL = 5000;
  var ERROR_MESSAGE_STRING = 'Encountered an error fetching random image';
  /*
   * Set up our mocks
   */

  var MOCK_FLICKR_IMG_SRC = 'MOCK_FLICKR_IMG_SRC';
  console.error = jest.fn();
  beforeEach(function () {
    /*
     * Reset timer mocks
     */
    jest.useFakeTimers();
    /*
     * Redeclare the fetch api mock
     */

    window.fetch = function (url) {
      return {
        json: function json() {
          if (url.includes('flickr.photos.search')) return {
            photos: {
              photo: [{
                id: 0
              }]
            }
          };
          if (url.includes('flickr.photos.getSizes')) return {
            sizes: {
              size: [{
                label: 'Large',
                source: MOCK_FLICKR_IMG_SRC
              }]
            }
          };
        }
      };
    };
    /*
     * Reset the console.error mock
     */


    console.error.mockReset();
  });
  it('Create snapshot', function () {
    var tree = _reactTestRenderer.default.create(_react.default.createElement(_flickrSlideshow.default, null)).toJSON();

    expect(tree).toMatchSnapshot();
  });
  describe('constructor', function () {
    it('should declare the initial state',
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var wrapper, _wrapper$instance, state;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
              _wrapper$instance = wrapper.instance(), state = _wrapper$instance.state;
              expect(state.counter).toEqual(0);
              expect(state.photoUrl).toEqual(null);
              expect(state.transition).toEqual(null);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it('should declare the _onErrorRetryCounter member variable as 0',
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2() {
      var wrapper, _wrapper$instance2, _onErrorRetryCounter;

      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
              _wrapper$instance2 = wrapper.instance(), _onErrorRetryCounter = _wrapper$instance2._onErrorRetryCounter;
              expect(_onErrorRetryCounter).toEqual(0);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  describe('Method: componentDidMount', function () {
    it('should invoke the _showRandomImage method',
    /*#__PURE__*/
    function () {
      var _ref3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(done) {
        var wrapper, instance;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                instance = wrapper.instance();
                instance._showRandomImage = jest.fn();
                _context3.next = 5;
                return instance.componentDidMount();

              case 5:
                expect(instance._showRandomImage).toHaveBeenCalled();
                done();

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());
    it('should declare the _slideshowInterval member variable as a setTimeout reference',
    /*#__PURE__*/
    function () {
      var _ref4 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(done) {
        var mockSetIntervalRef, wrapper, instance;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                mockSetIntervalRef = 'mockSetIntervalRef ' + new Date().getTime();
                wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                instance = wrapper.instance();
                instance._slideshowInterval = null;

                window.setInterval = function () {
                  return mockSetIntervalRef;
                };

                _context4.next = 7;
                return instance.componentDidMount();

              case 7:
                expect(instance._slideshowInterval).toEqual(mockSetIntervalRef);
                done();

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }());
    describe('without the `interval` prop', function () {
      it('should invoke _onSlideshowInterval method at an interval of 5000ms',
      /*#__PURE__*/
      function () {
        var _ref5 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee5(done) {
          var mockOnSlideShowIntervalRef, wrapper, instance;
          return _regenerator.default.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  mockOnSlideShowIntervalRef = 'mockOnSlideShowIntervalRef ' + new Date().getTime();
                  wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                  instance = wrapper.instance();
                  instance._onSlideshowInterval = mockOnSlideShowIntervalRef;
                  window.setInterval = jest.fn();
                  _context5.next = 7;
                  return instance.componentDidMount();

                case 7:
                  expect(window.setInterval).toHaveBeenCalledWith(mockOnSlideShowIntervalRef, DEFAULT_SLIDESHOW_INTERVAL);
                  done();

                case 9:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        return function (_x3) {
          return _ref5.apply(this, arguments);
        };
      }());
    });
    describe('provided with an `interval` prop', function () {
      it('should invoke _onSlideshowInterval method at the interval provided',
      /*#__PURE__*/
      function () {
        var _ref6 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee6(done) {
          var mockOnSlideShowIntervalRef, customInterval, wrapper, instance;
          return _regenerator.default.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  mockOnSlideShowIntervalRef = 'mockOnSlideShowIntervalRef ' + new Date().getTime();
                  customInterval = parseInt(Math.random() * (10000 - 5000) + 5000, 0);
                  wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, {
                    interval: customInterval
                  }));
                  instance = wrapper.instance();
                  instance._onSlideshowInterval = mockOnSlideShowIntervalRef;
                  window.setInterval = jest.fn();
                  _context6.next = 8;
                  return instance.componentDidMount();

                case 8:
                  expect(window.setInterval).toHaveBeenCalledWith(mockOnSlideShowIntervalRef, customInterval);
                  done();

                case 10:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        return function (_x4) {
          return _ref6.apply(this, arguments);
        };
      }());
    });
  });
  describe('Method: componentWillUnmount', function () {
    it('should clear the setInterval reference defined in the _slideshowInterval member variable',
    /*#__PURE__*/
    function () {
      var _ref7 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee7(done) {
        var mockSetIntervalRef, wrapper, instance;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                mockSetIntervalRef = 'mockSetIntervalRef ' + new Date().getTime();
                wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                instance = wrapper.instance();
                instance._slideshowInterval = mockSetIntervalRef;
                window.clearInterval = jest.fn();
                _context7.next = 7;
                return instance.componentWillUnmount();

              case 7:
                expect(window.clearInterval).toHaveBeenCalledWith(mockSetIntervalRef);
                done();

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      return function (_x5) {
        return _ref7.apply(this, arguments);
      };
    }());
  });
  describe('Method: _onSlideshowInterval', function () {
    it('should update the component with a truthy transition state',
    /*#__PURE__*/
    function () {
      var _ref8 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee8(done) {
        var wrapper, instance;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                instance = wrapper.instance();
                instance.setState = jest.fn();
                _context8.next = 5;
                return instance._onSlideshowInterval();

              case 5:
                expect(instance.setState).toHaveBeenCalledWith({
                  transition: true
                });
                done();

              case 7:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      return function (_x6) {
        return _ref8.apply(this, arguments);
      };
    }());
    it('should invoke the _showRandomImage method',
    /*#__PURE__*/
    function () {
      var _ref9 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee9(done) {
        var wrapper, instance;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                instance = wrapper.instance();
                instance._showRandomImage = jest.fn();
                _context9.next = 5;
                return instance._onSlideshowInterval();

              case 5:
                expect(instance._showRandomImage).toHaveBeenCalled();
                done();

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      return function (_x7) {
        return _ref9.apply(this, arguments);
      };
    }());
  });
  describe('Method: _showRandomImage', function () {
    it('should update the component state with an image url and a falsey transition state',
    /*#__PURE__*/
    function () {
      var _ref10 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee10(done) {
        var wrapper, instance;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                instance = wrapper.instance();
                instance.setState = jest.fn();
                _context10.next = 5;
                return instance._showRandomImage();

              case 5:
                expect(instance.setState).toHaveBeenCalledWith({
                  photoUrl: MOCK_FLICKR_IMG_SRC,
                  transition: expect.anything()
                });
                done();

              case 7:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      return function (_x8) {
        return _ref10.apply(this, arguments);
      };
    }());
    it('should update the component with a falsey transition state',
    /*#__PURE__*/
    function () {
      var _ref11 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee11(done) {
        var wrapper, instance;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                instance = wrapper.instance();
                instance.setState = jest.fn();
                _context11.next = 5;
                return instance._showRandomImage();

              case 5:
                expect(instance.setState).toHaveBeenCalledWith({
                  photoUrl: expect.anything(),
                  transition: false
                });
                done();

              case 7:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      return function (_x9) {
        return _ref11.apply(this, arguments);
      };
    }());
    it('should redeclare the _onErrorRetryCounter member variable as 0',
    /*#__PURE__*/
    function () {
      var _ref12 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee12(done) {
        var wrapper, instance;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                instance = wrapper.instance();
                instance._onErrorRetryCounter = 10;
                expect(instance._onErrorRetryCounter).toEqual(10);
                _context12.next = 6;
                return instance._showRandomImage();

              case 6:
                expect(instance._onErrorRetryCounter).toEqual(0);
                done();

              case 8:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      return function (_x10) {
        return _ref12.apply(this, arguments);
      };
    }());
    describe('onError', function () {
      it('should retry a maximum of 10 times',
      /*#__PURE__*/
      function () {
        var _ref13 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee13(done) {
          var wrapper, instance;
          return _regenerator.default.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  window.fetch = function () {
                    return Promise.reject();
                  };

                  wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                  instance = wrapper.instance();
                  expect(instance._onErrorRetryCounter).toEqual(0);
                  _context13.next = 6;
                  return instance._showRandomImage();

                case 6:
                  expect(instance._onErrorRetryCounter).toEqual(10);
                  done();

                case 8:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13);
        }));

        return function (_x11) {
          return _ref13.apply(this, arguments);
        };
      }());
      it('should console.error an error message',
      /*#__PURE__*/
      function () {
        var _ref14 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee14(done) {
          var mockErrorMessage, wrapper, instance;
          return _regenerator.default.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  mockErrorMessage = 'mockErrorMessage ' + new Date().getTime();

                  window.fetch = function () {
                    return Promise.reject(mockErrorMessage);
                  };

                  wrapper = (0, _enzyme.shallow)(_react.default.createElement(_flickrSlideshow.default, null));
                  instance = wrapper.instance();
                  _context14.next = 6;
                  return instance._showRandomImage();

                case 6:
                  expect(console.error).toHaveBeenCalledWith(ERROR_MESSAGE_STRING, mockErrorMessage);
                  done();

                case 8:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14);
        }));

        return function (_x12) {
          return _ref14.apply(this, arguments);
        };
      }());
    });
  });
});