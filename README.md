# React-web-notification [![Build Status](https://travis-ci.org/georgeOsdDev/react-web-notification.svg?branch=develop)](https://travis-ci.org/georgeOsdDev/react-web-notification) [![npm version](https://badge.fury.io/js/react-web-notification.svg)](http://badge.fury.io/js/react-web-notification)

React component with [HTML5 Web Notification API](https://developer.mozilla.org/en/docs/Web/API/notification).
This component show nothing in dom element, but trigger HTML5 Web Notification API with `render` method in the life cycle of React.js.

## Demo

[View Demo](http://georgeosddev.github.io/react-web-notification/example/)

## Installation

```bash
npm install --save react-web-notification
```

## API

### `Notification`

React component which wrap web-notification.

#### Props

```javascript
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

```

* `ignore` : if true, nothing will be happen

* `disableActiveWindow` : if true, nothing will be happen when window is active

* `notSupported()` : Called when [HTML5 Web Notification API](https://developer.mozilla.org/en/docs/Web/API/notification) is not supported.

* `onPermissionGranted()` : Called when permission granted.

* `onPermissionDenied()` : Called when permission denied. `Notification` will do nothing until permission granted again.

* `onShow(e, tag)` : Called when Desktop notification is shown.

* `onClick(e, tag)` : Called when Desktop notification is clicked.

* `onClose(e, tag)` : Called when Desktop notification is closed.

* `onError(e, tag)` : Called when Desktop notification happen error.

* `timeout` : milli sec to close notification automatically.(Default 5000)

* `title` : Notification title.

* `options` : Notification options. set `body`, `tag`, `icon` here.
  See also (https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification)


## Usage example

See  [example](https://github.com/georgeOsdDev/react-web-notification/tree/develop/example)

```bash
npm install
npm run start:example
```

## Tests

```bash
npm test
```