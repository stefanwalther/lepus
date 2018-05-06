const Lepus = require('./../../src/');
const sinon = require('sinon');
const sleep = require('sleep');

describe('INTEGRATION => publishMessage', () => {
  let lepus = null;
  before(async () => {
    lepus = new Lepus();
    await lepus.connect();
  });
  after(async () => {
    await lepus.disconnect();
  });

  it('succeeds with default settings', async () => {
    let publishOpts = {
      exchange: {
        type: 'topic',
        name: 'test'
      },
      key: 'test-key',
      payload: {},
      options: {}
    };
    let subscribeOpts = Object.assign(publishOpts, {
      queue: {
        name: 'test-queue'
      }
    });

    await lepus.publishMessage(publishOpts);

    let spy = sinon.stub().resolves();
    await lepus.subscribeMessage(subscribeOpts, spy);

    sleep.sleep(2);
    expect(spy).to.have.been.calledOnce;

    expect(spy.firstCall.args[0]).to.be.empty;
    expect(spy.firstCall.args[1]).to.have.a.property('fields').to.deep.contains({exchange: 'test'});
    expect(spy.firstCall.args[1]).to.have.a.property('fields').to.deep.contains({routingKey: publishOpts.key});
  });

});
