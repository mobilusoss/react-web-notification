# React-web-notification [![Build Status](https://travis-ci.org/georgeOsdDev/react-web-notification.svg?branch=develop)](https://travis-ci.org/georgeOsdDev/react-web-notification) [![npm version](https://badge.fury.io/js/react-web-notification.svg)](http://badge.fury.io/js/react-web-notification)

React component with [HTML5 Web Notification API](https://developer.mozilla.org/en/docs/Web/API/notification).
This component show nothing in dom element, but trigger HTML5 Web Notification API with `render` method in the life cycle of React.js.

## Demo

[View Demo](https://georgeosddev.github.io/react-web-notification/example/)

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

```

* `ignore` : if true, nothing will be happen

* `disableActiveWindow` : if true, nothing will be happen when window is active

* `askAgain` : if true, `window.Notification.requestPermission` will be called on `componentDidMount`, even if it was denied before,

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

* `swRegistration` : ServiceWorkerRegistration. Use this prop to delegate the notification creation to a service worker.
  See also (https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification)
  ⚠️ `onShow`, `onClick`, `onClose` and `onError` handlers won't work when notification is created by the service worker.


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


### Known Issues

 * [Notification.sound](https://github.com/georgeOsdDev/react-web-notification/issues/13)
  `Notification.sound` is [not supported in any browser](https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility).
  You can emulate it with `onShow` callback. see [example](https://github.com/georgeOsdDev/react-web-notification/tree/develop/example).

