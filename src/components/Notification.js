'use strict';

import React from 'react';

const PERMISSION_GRANTED = 'granted';

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
    } else {
      supported = false;
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

  componentDidMount(){
    if (this.props.disableActiveWindow) {
      if (window.addEventListener){
        window.addEventListener('focus', this.onWindowFocus);
        window.addEventListener('blur', this.onWindowBlur);
      } else if (window.attachEvent){
        window.attachEvent('focus', this.onWindowFocus);
        window.attachEvent('blur', this.onWindowBlur);
      }
    }

    if (!this.state.supported) {
      this.props.notSupported();
    } else {
      if(this.state.granted) {
      this.props.onPermissionGranted();
      } else {
        window.Notification.requestPermission( (permission) => {
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
    }
  }

  componentWillUnmount(){
    if (this.props.disableActiveWindow) {
      if (window.removeEventListner){
        window.removeEventListener('focus', this.onWindowFocus);
        window.removeEventListener('blur', this.onWindowBlur);
      } else if (window.detachEvent){
        window.detachEvent('focus', this.onWindowFocus);
        window.detachEvent('blur', this.onWindowBlur);
      }
    }
  }

  render() {
    let doNotShowOnActiveWindow = this.props.disableActiveWindow && this.windowFocus;
    if (!this.props.ignore && this.props.title && this.state.supported && this.state.granted && !doNotShowOnActiveWindow) {

      let opt = this.props.options;
      if (typeof opt.tag !== 'string') {
        opt.tag = 'web-notification-' + seq();
      }

      if (!this.notifications[opt.tag]) {
        let n = new window.Notification(this.props.title, opt);
        n.onshow = (e) => {
          this.props.onShow(e, opt.tag);
          setTimeout(() => {
            this.close(opt.tag);
          }, this.props.timeout);
        };
        n.onclick = (e) => {this.props.onClick(e, opt.tag); };
        n.onclose = (e) => {this.props.onClose(e, opt.tag); };
        n.onerror = (e) => {this.props.onError(e, opt.tag); };

        this.notifications[opt.tag] = n;
      }
    }

    // return null cause
    // Error: Invariant Violation: Notification.render(): A valid ReactComponent must be returned. You may have returned undefined, an array or some other invalid object.
    return (
      <input type='hidden' name='dummy-for-react-web-notification' style={{display: 'none'}} />
    );
  }

  close(tag) {
    if (this.notifications[tag] && typeof this.notifications[tag].close === 'function') {
      this.notifications[tag].close();
    }
  }

  // for debug
  _getNotificationInstance(tag) {
    return this.notifications[tag];
  }
}

Notification.propTypes = {
  ignore: React.PropTypes.bool,
  disableActiveWindow: React.PropTypes.bool,
  notSupported: React.PropTypes.func,
  onPermissionGranted: React.PropTypes.func,
  onPermissionDenied: React.PropTypes.func,
  onShow: React.PropTypes.func,
  onClick: React.PropTypes.func,
  onClose: React.PropTypes.func,
  onError: React.PropTypes.func,
  timeout: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
  options: React.PropTypes.object
};

Notification.defaultProps = {
  ignore: false,
  disableActiveWindow: false,
  notSupported: () => {},
  onPermissionGranted: () => {},
  onPermissionDenied: () => {},
  onShow: () => {},
  onClick: () => {},
  onClose: () => {},
  onError: () => {},
  timeout: 5000,
  options: {}
};

export default Notification;
