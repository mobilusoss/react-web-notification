'use strict';
import React from 'react/addons';
import chai from 'chai';
import sinon from 'sinon';
let expect = chai.expect;
import events from 'events'
let EventEmitter = events.EventEmitter;
import Notification from '../../components/Notification';
const {TestUtils} = React.addons;

const PERMISSION_GRANTED = 'granted';
const PERMISSION_DENIED = 'denied';

describe('Test of Notification', () => {

  let component;

  beforeEach(() => {
  });

  describe('Notification component', () => {
    it('should have default properties', function () {
      component = TestUtils.renderIntoDocument(<Notification title='test'/>);
      expect(component.props.ignore).to.be.eql(false);
      expect(component.props.disableActiveWindow).to.be.eql(false);
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
    describe('When Notification is not supported', () => {
      let cached, stub;

      before(() => {
        stub = sinon.stub(window.Notification, 'requestPermission');
        cached = window.Notification;
        window.Notification = null;
      });

      after(() => {
        window.Notification = cached;
        stub.restore();
      });

      it('should call notSupported prop', () => {
        let spy = sinon.spy();
        component = TestUtils.renderIntoDocument(<Notification title='test' notSupported={spy}/>);
        expect(spy.calledOnce).to.be.eql(true);
        expect(stub.called).to.be.eql(false);
      });
    });

    describe('When Notification is supported', () => {
      describe('start request permission ', () =>{
        describe('When Notification is denied', () => {
          describe('Check callbacks', ()=> {

            let stub, spy1, spy2;
            before(() => {
              spy1 = sinon.spy();
              spy2 = sinon.spy();
              stub = sinon.stub(window.Notification, 'requestPermission', function(cb){
                return cb(PERMISSION_DENIED);
              });
              component = TestUtils.renderIntoDocument(<Notification title='test' notSupported={spy1} onPermissionDenied={spy2}/>);
            });

            after(() => {
              stub.restore();
            });

            it('should call window.Notification.requestPermission', () => {
              expect(stub.calledOnce).to.be.eql(true);
            });

            it('should call onPermissionDenied prop', () => {
              expect(spy1.called).to.be.eql(false);
              expect(spy2.calledOnce).to.be.eql(true);
            });
          });
        });

        describe('When Notification is granted', () => {
          let stub;
          before(() => {
            stub = sinon.stub(window.Notification, 'requestPermission', function(cb){
              return cb(PERMISSION_GRANTED);
            });
          });

          after(() => {
            stub.restore();
          });

          describe('Check callbacks', ()=> {
            let spy1, spy2, spy3;
            before(() => {
              spy1 = sinon.spy();
              spy2 = sinon.spy();
              spy3 = sinon.spy();
              component = TestUtils.renderIntoDocument(<Notification title='test' notSupported={spy1} onPermissionDenied={spy2} onPermissionGranted={spy3}/>);
            });

            it('should call window.Notification.requestPermission', () => {
              expect(stub.called).to.be.eql(true);
            });

            it('should call onPermissionDenied prop', () => {
              expect(spy1.called).to.be.eql(false);
              expect(spy2.called).to.be.eql(false);
              expect(spy3.calledOnce).to.be.eql(true);
            });
          });

          describe('Handle component properties', () => {

            let stubConstructor, onShowSpy, onClickSpy, onCloseSpy, onErrorSpy, ee;

            beforeEach(() => {
              EventEmitter.prototype.addEventListener = EventEmitter.prototype.addListener;
              ee = new EventEmitter();

              stubConstructor = sinon.stub(window, 'Notification');
              stubConstructor.onFirstCall().returns(ee);
            });

            afterEach(()=>{
              // stub.restore();
              stubConstructor.restore();
            });

            describe('when ignore prop is true', () => {
              onShowSpy = sinon.spy();
              onClickSpy = sinon.spy();
              onCloseSpy = sinon.spy();
              onErrorSpy = sinon.spy();

              it('does not trigger Notification', () => {
                component = TestUtils.renderIntoDocument(<Notification title='test' ignore={true} onShow={onShowSpy} onClick={onClickSpy} onClose={onCloseSpy} onError={onErrorSpy} />);
                expect(stubConstructor.calledWithNew()).to.be.eql(false);
                expect(onShowSpy.called).to.be.eql(false);
                expect(onClickSpy.called).to.be.eql(false);
                expect(onCloseSpy.called).to.be.eql(false);
                expect(onErrorSpy.called).to.be.eql(false);
              });
            });

            describe('when ignore prop is false', () => {
              const MY_TITLE = 'mytitle';
              const MY_OPTIONS = {
                tag: 'mytag',
                body: 'mybody',
                icon: 'myicon',
                lang: 'en',
                dir: 'ltr'
              };
              onShowSpy = sinon.spy();
              onClickSpy = sinon.spy();
              onCloseSpy = sinon.spy();
              onErrorSpy = sinon.spy();

              it('trigger Notification with specified title and options', () => {
                component = TestUtils.renderIntoDocument(<Notification title={MY_TITLE} options={MY_OPTIONS} ignore={false} onShow={onShowSpy} onClick={onClickSpy} onClose={onCloseSpy} onError={onErrorSpy} />);
                expect(stubConstructor.calledWithNew()).to.be.eql(true);
                expect(stubConstructor.calledWith(MY_TITLE, MY_OPTIONS)).to.be.eql(true);
              });

              it('call onShow prop when notification is shown', () => {
                let n = component._getNotificationInstance('mytag');
                n.onshow('showEvent');
                expect(onShowSpy.calledOnce).to.be.eql(true);
                let args = onShowSpy.args[0];
                expect(args[0]).to.be.eql('showEvent');
                expect(args[1]).to.be.eql('mytag');
                expect(onClickSpy.called).to.be.eql(false);
                expect(onCloseSpy.called).to.be.eql(false);
                expect(onErrorSpy.called).to.be.eql(false);
              });

              it('call onClick prop when notification is clicked', () => {
                let n = component._getNotificationInstance('mytag');
                n.onclick('clickEvent');
                expect(onClickSpy.calledOnce).to.be.eql(true);
                let args = onClickSpy.args[0];
                expect(args[0]).to.be.eql('clickEvent');
                expect(args[1]).to.be.eql('mytag');
              });

              it('call onCLose prop when notification is closed', () => {
                let n = component._getNotificationInstance('mytag');
                n.onclose('closeEvent');
                expect(onCloseSpy.calledOnce).to.be.eql(true);
                let args = onCloseSpy.args[0];
                expect(args[0]).to.be.eql('closeEvent');
                expect(args[1]).to.be.eql('mytag');
              });

              it('call onError prop when notification throw error', () => {
                let n = component._getNotificationInstance('mytag');
                n.onerror('errorEvent');
                expect(onErrorSpy.calledOnce).to.be.eql(true);
                let args = onErrorSpy.args[0];
                expect(args[0]).to.be.eql('errorEvent');
                expect(args[1]).to.be.eql('mytag');
              });
            });
          });
        });
      });
    });
  });
});
