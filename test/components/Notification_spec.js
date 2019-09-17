import React from 'react';
import ReactDom from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import chai from 'chai';
import sinon from 'sinon';
let expect = chai.expect;
import events from 'events'
let EventEmitter = events.EventEmitter;
import Notification from '../../src/components/Notification';

const PERMISSION_GRANTED = 'granted';
const PERMISSION_DENIED = 'denied';
const PERMISSION_DEFAULT = 'default';

describe('Test of Notification', () => {

  let component;

  beforeEach(() => {
  });

  describe('Notification component', () => {
    it('should have default properties', function () {
      component = ReactTestUtils.renderIntoDocument(<Notification title='test'/>);
      expect(component.props.ignore).to.be.eql(false);
      expect(component.props.disableActiveWindow).to.be.eql(false);
      expect(component.props.askAgain).to.be.eql(false);
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
      component = ReactTestUtils.renderIntoDocument(<Notification title='test'/>);
      const el = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
      expect(el.length).to.be.eql(1);
      expect(ReactDom.findDOMNode(el[0]).type).to.be.eql('hidden');
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
        component = ReactTestUtils.renderIntoDocument(<Notification title='test' notSupported={spy}/>);
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
              stub = sinon.stub(window.Notification, 'requestPermission').callsFake(function(cb){
                return cb(PERMISSION_DENIED);
              });
              component = ReactTestUtils.renderIntoDocument(<Notification title='test' notSupported={spy1} onPermissionDenied={spy2}/>);
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

        describe('When Notification is already denied', () => {
          describe('Check callbacks', ()=> {

            let stub1, stub2, spy1, spy2;
            before(() => {
              spy1 = sinon.spy();
              spy2 = sinon.spy();
              stub1 = sinon.stub(window.Notification, 'permission').get(function getterFn() {
                return PERMISSION_DENIED;
              });
              stub2 = sinon.stub(window.Notification, 'requestPermission').callsFake(function(cb){
                return cb(PERMISSION_DENIED);
              });
              component = ReactTestUtils.renderIntoDocument(<Notification title='test' notSupported={spy1} onPermissionDenied={spy2}/>);
            });

            after(() => {
              stub1.restore();
              stub2.restore();
            });

            it('should not call window.Notification.requestPermission', () => {
              expect(stub2.calledOnce).to.be.eql(false);
            });

            it('should call onPermissionDenied prop', () => {
              expect(spy1.called).to.be.eql(false);
              expect(spy2.calledOnce).to.be.eql(true);
            });
          });
        });

        describe('When Notification is already denied, but `askAgain` prop is true', () => {
          describe('Check callbacks', ()=> {

            let stub1, stub2, spy1, spy2, spy3;
            before(() => {
              spy1 = sinon.spy();
              spy2 = sinon.spy();
              spy3 = sinon.spy();
              stub1 = sinon.stub(window.Notification, 'permission').get(function getterFn() {
                return PERMISSION_DENIED;
              });
              stub2 = sinon.stub(window.Notification, 'requestPermission').callsFake(function(cb){
                return cb(PERMISSION_GRANTED);
              });
              component = ReactTestUtils.renderIntoDocument(<Notification title='test' notSupported={spy1} onPermissionDenied={spy2} onPermissionGranted={spy3} askAgain={true}/>);
            });

            after(() => {
              stub1.restore();
              stub2.restore();
            });

            it('should call window.Notification.requestPermission', () => {
              expect(stub2.calledOnce).to.be.eql(true);
            });

            it('should call onPermissionGranted prop', () => {
              expect(spy1.called).to.be.eql(false);
              expect(spy2.called).to.be.eql(false);
              expect(spy3.calledOnce).to.be.eql(true);
            });
          });
        });

        describe('When Notification is granted', () => {
          let stub;
          before(() => {
            stub = sinon.stub(window.Notification, 'requestPermission').callsFake(function(cb){
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
              component = ReactTestUtils.renderIntoDocument(<Notification title='test' notSupported={spy1} onPermissionDenied={spy2} onPermissionGranted={spy3}/>);
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
                component = ReactTestUtils.renderIntoDocument(<Notification title='test' ignore={true} onShow={onShowSpy} onClick={onClickSpy} onClose={onCloseSpy} onError={onErrorSpy} />);
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
                component = ReactTestUtils.renderIntoDocument(<Notification title={MY_TITLE} options={MY_OPTIONS} ignore={false} onShow={onShowSpy} onClick={onClickSpy} onClose={onCloseSpy} onError={onErrorSpy} />);
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
            describe('test of autoClose timer', () => {
              const MY_TITLE = 'mytitle';
              const MY_OPTIONS = {
                tag: 'mytag',
                body: 'mybody',
                icon: 'myicon',
                lang: 'en',
                dir: 'ltr'
              };
              describe('when `props.timeout` is less than eql 0', () => {
                let n;
                before(() => {
                  component = ReactTestUtils.renderIntoDocument(<Notification title={MY_TITLE} options={MY_OPTIONS} ignore={false} timeout={0}/>);
                  n = component._getNotificationInstance('mytag');
                  sinon.stub(n, 'close');
                  n.onshow('showEvent');
                });
                after(() => {
                  n.close.restore();
                })
                it('will not trigger close automatically', (done) => {
                  setTimeout(() => {
                    expect(n.close.called).to.be.eql(false);
                    done();
                  }, 200);
                })
              })
              describe('when `props.timeout` is greater than 0', () => {
                let n;
                before(() => {
                  component = ReactTestUtils.renderIntoDocument(<Notification title={MY_TITLE} options={MY_OPTIONS} ignore={false} timeout={50}/>);
                  n = component._getNotificationInstance('mytag');
                  sinon.stub(n, 'close');
                  n.onshow('showEvent');
                });
                after(() => {
                  n.close.restore();
                });
                it('will trigger close automatically', (done) => {
                  setTimeout(() => {
                    expect(n.close.called).to.be.eql(true);
                    done();
                  }, 200);
                })
              })
            })
            describe('when swRegistration prop is defined', () => {
              const swRegistrationMock = { showNotification: sinon.stub().resolves({ notification: ee }) }
              const MY_TITLE = 'mytitle';
              const MY_OPTIONS = {
                tag: 'mytag',
                body: 'mybody',
                icon: 'myicon',
                lang: 'en',
                dir: 'ltr',
                requireInteraction: true,
              };

              it('does not trigger Notification but trigger swRegistration.showNotification', () => {
                component = ReactTestUtils.renderIntoDocument(<Notification title={MY_TITLE} options={MY_OPTIONS} swRegistration={swRegistrationMock} />);
                expect(stubConstructor.calledWithNew()).to.be.eql(false);
                expect(swRegistrationMock.showNotification.calledWith(MY_TITLE, MY_OPTIONS)).to.be.eql(true);
              });
            });
          });
        });
      });
    });
  });
});
