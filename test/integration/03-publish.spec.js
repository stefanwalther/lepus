const Lepus = require('./../../src/');

describe('publishMessage', () => {
  let lepus = null;
  before(async () => {
    lepus = new Lepus();
    await lepus.connect();
  });
  after(async () => {
    await lepus.disconnect();
  });

  it('succeeds with default settings', async () => {
    let opts = {
      exchange: {
        type: 'topic',
        name: 'test'
      },
      key: 'test-key',
      payload: {},
      options: {}
    };
  });

});
