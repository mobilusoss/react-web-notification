import React from 'react';
import { bool, func, number, object, string } from 'prop-types';

const PERMISSION_GRANTED = 'granted';
const PERMISSION_DENIED = 'denied';

const seqGen = () => {
  let i = 0;
  return () => {
    return i++;
  };
};
const seq = seqGen();

class Notification extends React.Component {
  constructor(props) {
    super(props);

    let supported = false;
    let granted = false;
    if (('Notification' in window) && window.Notification) {
      supported = true;
      if (window.Notification.permission === PERMISSION_GRANTED) {
        granted = true;
      }
    }

    this.state = {
      supported: supported,
      granted: granted
    };
    // Do not save Notification instance in state
    this.notifications = {};
    this.windowFocus = true;
    this.onWindowFocus = this._onWindowFocus.bind(this);
    this.onWindowBlur = this._onWindowBlur.bind(this);
  }

  _onWindowFocus(){
    this.windowFocus = true;
  }

  _onWindowBlur(){
    this.windowFocus = false;
  }

  _askPermission(){
    window.Notification.requestPermission((permission) => {
      let result = permission === PERMISSION_GRANTED;
      this.setState({
        granted: result
      }, () => {
        if (result) {
          this.props.onPermissionGranted();
        } else {
          this.props.onPermissionDenied();
        }
      });
    });
  }

  componentDidMount(){
    if (this.props.disableActiveWindow) {
      window.addEventListener('focus', this.onWindowFocus);
      window.addEventListener('blur', this.onWindowBlur);
    }

    if (!this.state.supported) {
      this.props.notSupported();
    } else if (this.state.granted) {
      this.props.onPermissionGranted();
    } else {
      if (window.Notification.permission === PERMISSION_DENIED){
        if (this.props.askAgain){
          this._askPermission();
        } else {
          this.props.onPermissionDenied();
        }
      } else {
        this._askPermission();
      }
    }
  }

  componentWillUnmount(){
    if (this.props.disableActiveWindow) {
      window.removeEventListener('focus', this.onWindowFocus);
      window.removeEventListener('blur', this.onWindowBlur);
    }
  }

  doNotification() {
    let opt = this.props.options;
    if (typeof opt.tag !== 'string') {
      opt.tag = 'web-notification-' + seq();
    }
    if (this.notifications[opt.tag]) {
      return;
    }

    if (this.props.swRegistration && this.props.swRegistration.showNotification) {
      this.props.swRegistration.showNotification(this.props.title, opt)
      this.notifications[opt.tag] = {};
    } else {
      const n = new window.Notification(this.props.title, opt);
      n.onshow = e => {
        this.props.onShow(e, opt.tag);
        if (this.props.timeout > 0) {
          setTimeout(() => {
            this.close(n);
          }, this.props.timeout);
        }
      };
      n.onclick = e => { this.props.onClick(e, opt.tag); };
      n.onclose = e => { this.props.onClose(e, opt.tag); };
      n.onerror = e => { this.props.onError(e, opt.tag); };

      this.notifications[opt.tag] = n;
    }
  }

  render() {
    let doNotShowOnActiveWindow = this.props.disableActiveWindow && this.windowFocus;
    if (!this.props.ignore && this.props.title && this.state.supported && this.state.granted && !doNotShowOnActiveWindow) {
      this.doNotification();
    }

    // return null cause
    // Error: Invariant Violation: Notification.render(): A valid ReactComponent must be returned. You may have returned undefined, an array or some other invalid object.
    return (
      <input type='hidden' name='dummy-for-react-web-notification' style={{display: 'none'}} />
    );
  }

  close(n) {
    if (n && typeof n.close === 'function') {
      n.close();
    }
  }

  // for debug
  _getNotificationInstance(tag) {
    return this.notifications[tag];
  }
}

Notification.propTypes = {
  ignore: bool,
  disableActiveWindow: bool,
  askAgain: bool,
  notSupported: func,
  onPermissionGranted: func,
  onPermissionDenied: func,
  onShow: func,
  onClick: func,
  onClose: func,
  onError: func,
  timeout: number,
  title: string.isRequired,
  options: object,
  swRegistration: object,
};

Notification.defaultProps = {
  ignore: false,
  disableActiveWindow: false,
  askAgain: false,
  notSupported: () => {},
  onPermissionGranted: () => {},
  onPermissionDenied: () => {},
  onShow: () => {},
  onClick: () => {},
  onClose: () => {},
  onError: () => {},
  timeout: 5000,
  options: {},
  swRegistration: null,
};

export default Notification;
