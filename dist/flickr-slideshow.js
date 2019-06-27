"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var Helpers = _interopRequireWildcard(require("./helpers"));

var FLOOR_TIME = '1072915200000'; // 01/01/2004 @ 12:00am (UTC)

var SLIDESHOW_INTERVAL = 5000;
var FLICKR_SEARCH_URI = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=fef7e85a4fbb15aa1b742d37657d70c3&max_upload_date={randomTime}&sort=date-posted-desc&per_page=500&page=0&format=json&nojsoncallback=1';
var FLICKR_GET_SIZES_URI = 'https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=fef7e85a4fbb15aa1b742d37657d70c3&photo_id={photoId}&format=json&nojsoncallback=1';

var FlickrSlideshow =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(FlickrSlideshow, _Component);
  (0, _createClass2.default)(FlickrSlideshow, null, [{
    key: "defaultProps",
    get: function get() {
      return {
        interval: SLIDESHOW_INTERVAL
      };
    }
  }]);

  function FlickrSlideshow(props) {
    var _this;

    (0, _classCallCheck2.default)(this, FlickrSlideshow);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FlickrSlideshow).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_onSlideshowInterval", function () {
      _this.setState({
        transition: true
      });

      _this._showRandomImage();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_showRandomImage",
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var timeNow, randomTime, searchRes, searchJson, searchResultsLen, randomItemIndex, photoId, photoRes, photoJson, photo;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              /*
               * Select a random Unix timestamp between now and 2004
               */
              timeNow = new Date().getTime();
              randomTime = Helpers.randomNumber(FLOOR_TIME, timeNow);
              /*
               * Fetch latest 100 photos uploaded by `randomTime`
               */

              _context.next = 5;
              return fetch(Helpers.supplantStr(FLICKR_SEARCH_URI, {
                randomTime: randomTime
              }));

            case 5:
              searchRes = _context.sent;
              _context.next = 8;
              return searchRes.json();

            case 8:
              searchJson = _context.sent;

              /*
               * Select a random item from the search results array
               */
              searchResultsLen = searchJson.photos.photo.length;
              randomItemIndex = Helpers.randomNumber(0, searchResultsLen);
              photoId = searchJson.photos.photo[randomItemIndex].id;
              /*
               * Fetch the selected photo sizes 
               */

              _context.next = 14;
              return fetch(Helpers.supplantStr(FLICKR_GET_SIZES_URI, {
                photoId: photoId
              }));

            case 14:
              photoRes = _context.sent;
              _context.next = 17;
              return photoRes.json();

            case 17:
              photoJson = _context.sent;
              photo = photoJson.sizes.size.find(function (p) {
                return p.label === 'Large';
              });

              if (!photo) {
                /*
                 * If no 'Large' photo exists, just use the first item
                 */
                photo = photoJson.sizes.size[0];
              }
              /*
               * Update the component state with our result
               */


              _this.setState({
                photoUrl: photo.source,
                transition: false
              });

              _this._onErrorRetryCounter = 0;
              _context.next = 33;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](0);

              if (!(_this._onErrorRetryCounter < 10)) {
                _context.next = 32;
                break;
              }

              _this._onErrorRetryCounter++;
              _context.next = 30;
              return _this._showRandomImage();

            case 30:
              _context.next = 33;
              break;

            case 32:
              console.error('Encountered an error fetching random image', _context.t0);

            case 33:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 24]]);
    })));
    _this.state = {
      counter: 0,
      photoUrl: null,
      transition: null
    };
    _this._onErrorRetryCounter = 0;
    return _this;
  }

  (0, _createClass2.default)(FlickrSlideshow, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._showRandomImage();

      this._slideshowInterval = setInterval(this._onSlideshowInterval, this.props.interval);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this._slideshowInterval);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          transition = _this$state.transition,
          photoUrl = _this$state.photoUrl;
      return _react.default.createElement("div", {
        className: "FlickrSlideshow animated ".concat(transition ? 'fadeOut' : 'fadeIn'),
        style: {
          backgroundImage: "url(".concat(photoUrl, ")"),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
          width: '100%'
        }
      });
    }
  }]);
  return FlickrSlideshow;
}(_react.Component);

(0, _defineProperty2.default)(FlickrSlideshow, "propTypes", {
  interval: _propTypes.default.number
});
var _default = FlickrSlideshow;
exports.default = _default;