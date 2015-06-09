'use strict';
import React from 'react/addons';
import chai from 'chai';
let expect = chai.expect;
import Notification from '../../components/Notification';
const {TestUtils} = React.addons;

describe('Test of Notification', () => {

  let component;

  beforeEach(() => {
  });

  describe('Notification component', () => {
    it('should have default properties', function () {
      component = TestUtils.renderIntoDocument(<Notification title='test'/>);
      expect(component.props.ignore).to.be.eql(false);
      expect(typeof component.props.notSupported).to.be.eql('function');
      expect(typeof component.props.onPermissionGranted).to.be.eql('function');
      expect(typeof component.props.onPermissionDenied).to.be.eql('function');
      expect(typeof component.props.onShow).to.be.eql('function');
      expect(typeof component.props.onClick).to.be.eql('function');
      expect(typeof component.props.onClose).to.be.eql('function');
      expect(typeof component.props.onError).to.be.eql('function');
      expect(component.props.timeout).to.be.eql(5000);
      expect(component.props.options).to.be.empty;
    });

    it('should render dummy hidden tag', function () {
      component = TestUtils.renderIntoDocument(<Notification title='test'/>);
      const el = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
      expect(el.length).to.be.eql(1);
      expect(React.findDOMNode(el[0]).type).to.be.eql('hidden');
    });
  });

  describe('Handling HTML5 Web Notification API', () => {
    it('should Write test', function () {

      // See https://github.com/alexgibson/notify.js/blob/master/test/tests.js

      expect(false).to.be.eql(true);
    });
  });
});
