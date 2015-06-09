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
    if (!('Notification' in window)) {
      supported = false;
    } else {
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
  }

  componentDidMount(){
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

  render() {
    if (!this.props.ignore && this.props.title && this.state.supported && this.state.granted) {

      let opt = this.props.options;
      if (typeof opt.tag !== 'string') {
        opt.tag = 'web-notification-' + seq();
      }

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

    // is this neccessary?
    return (
      <input type='hidden' name='dummy-for-react-web-notification' style={{display: 'none'}} />
    );
  }

  close(tag) {
    if (this.notifications[tag] && typeof this.notifications[tag].close === 'function') {
      this.notifications[tag].close();
    }
  }
}

Notification.propTypes = {
  ignore: React.PropTypes.bool,
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
