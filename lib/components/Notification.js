'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PERMISSION_GRANTED = 'granted';
var PERMISSION_DENIED = 'denied';

var seqGen = function seqGen() {
  var i = 0;
  return function () {
    return i++;
  };
};
var seq = seqGen();

var Notification = function (_React$Component) {
  _inherits(Notification, _React$Component);

  function Notification(props) {
    _classCallCheck(this, Notification);

    var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, props));

    var supported = false;
    var granted = false;
    if ('Notification' in window && window.Notification) {
      supported = true;
      if (window.Notification.permission === PERMISSION_GRANTED) {
        granted = true;
      }
    }

    _this.state = {
      supported: supported,
      granted: granted
    };
    // Do not save Notification instance in state
    _this.notifications = {};
    _this.windowFocus = true;
    _this.onWindowFocus = _this._onWindowFocus.bind(_this);
    _this.onWindowBlur = _this._onWindowBlur.bind(_this);
    return _this;
  }

  _createClass(Notification, [{
    key: '_onWindowFocus',
    value: function _onWindowFocus() {
      this.windowFocus = true;
    }
  }, {
    key: '_onWindowBlur',
    value: function _onWindowBlur() {
      this.windowFocus = false;
    }
  }, {
    key: '_askPermission',
    value: function _askPermission() {
      var _this2 = this;

      window.Notification.requestPermission(function (permission) {
        var result = permission === PERMISSION_GRANTED;
        _this2.setState({
          granted: result
        }, function () {
          if (result) {
            _this2.props.onPermissionGranted();
          } else {
            _this2.props.onPermissionDenied();
          }
        });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.disableActiveWindow) {
        if (window.addEventListener) {
          window.addEventListener('focus', this.onWindowFocus);
          window.addEventListener('blur', this.onWindowBlur);
        } else if (window.attachEvent) {
          window.attachEvent('focus', this.onWindowFocus);
          window.attachEvent('blur', this.onWindowBlur);
        }
      }

      if (!this.state.supported) {
        this.props.notSupported();
      } else if (this.state.granted) {
        this.props.onPermissionGranted();
      } else {
        if (window.Notification.permission === PERMISSION_DENIED) {
          if (this.props.askAgain) {
            this._askPermission();
          } else {
            this.props.onPermissionDenied();
          }
        } else {
          this._askPermission();
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.disableActiveWindow) {
        if (window.removeEventListner) {
          window.removeEventListener('focus', this.onWindowFocus);
          window.removeEventListener('blur', this.onWindowBlur);
        } else if (window.detachEvent) {
          window.detachEvent('focus', this.onWindowFocus);
          window.detachEvent('blur', this.onWindowBlur);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var doNotShowOnActiveWindow = this.props.disableActiveWindow && this.windowFocus;
      if (!this.props.ignore && this.props.title && this.state.supported && this.state.granted && !doNotShowOnActiveWindow) {

        var opt = this.props.options;
        if (typeof opt.tag !== 'string') {
          opt.tag = 'web-notification-' + seq();
        }

        if (!this.notifications[opt.tag]) {
          var n = new window.Notification(this.props.title, opt);
          n.onshow = function (e) {
            _this3.props.onShow(e, opt.tag);
            setTimeout(function () {
              _this3.close(n);
            }, _this3.props.timeout);
          };
          n.onclick = function (e) {
            _this3.props.onClick(e, opt.tag);
          };
          n.onclose = function (e) {
            _this3.props.onClose(e, opt.tag);
          };
          n.onerror = function (e) {
            _this3.props.onError(e, opt.tag);
          };

          this.notifications[opt.tag] = n;
        }
      }

      // return null cause
      // Error: Invariant Violation: Notification.render(): A valid ReactComponent must be returned. You may have returned undefined, an array or some other invalid object.
      return _react2.default.createElement('input', { type: 'hidden', name: 'dummy-for-react-web-notification', style: { display: 'none' } });
    }
  }, {
    key: 'close',
    value: function close(n) {
      if (n && typeof n.close === 'function') {
        n.close();
      }
    }

    // for debug

  }, {
    key: '_getNotificationInstance',
    value: function _getNotificationInstance(tag) {
      return this.notifications[tag];
    }
  }]);

  return Notification;
}(_react2.default.Component);

Notification.propTypes = {
  ignore: _propTypes.bool,
  disableActiveWindow: _propTypes.bool,
  askAgain: _propTypes.bool,
  notSupported: _propTypes.func,
  onPermissionGranted: _propTypes.func,
  onPermissionDenied: _propTypes.func,
  onShow: _propTypes.func,
  onClick: _propTypes.func,
  onClose: _propTypes.func,
  onError: _propTypes.func,
  timeout: _propTypes.number,
  title: _propTypes.string.isRequired,
  options: _propTypes.object
};

Notification.defaultProps = {
  ignore: false,
  disableActiveWindow: false,
  askAgain: false,
  notSupported: function notSupported() {},
  onPermissionGranted: function onPermissionGranted() {},
  onPermissionDenied: function onPermissionDenied() {},
  onShow: function onShow() {},
  onClick: function onClick() {},
  onClose: function onClose() {},
  onError: function onError() {},
  timeout: 5000,
  options: {}
};

exports.default = Notification;