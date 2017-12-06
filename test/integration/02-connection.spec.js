const Lepus = require('./../../src');

describe('INTEGRATION => Connection', () => {

  describe('Initialization', async () => {
    let lepus = null;
    before(async () => {
      lepus = new Lepus();
    });
    after(async () => {
      await lepus.disconnect();
    });

    it('returns a connection', async () => {
      let conn = await lepus.connect();
      expect(conn).to.exist;
    });
  });

  describe('Initialization', () => {

    let lepus = null;
    after(async () => {
      await lepus.disconnect();
    });

    it('fails with wrong connection', () => {
      lepus = new Lepus('amqp://guest:guest@localhost:1111', {retry_behavior: {enabled: false}});
      return expect(lepus.connect()).to.be.rejectedWith(Error);
    }).timeout(2000);

  });

  xdescribe('Reuse', () => {
    let lepus = null;
    before(() => {
      lepus = new Lepus();
    });
    after(async () => {
      await lepus.disconnect();
    });
    it('reconnects if the connection is already established', async () => {

      expect(lepus.Connection).to.not.exist;

      let conn = await lepus.connect();
      expect(conn).to.exist;
      expect(lepus.Connection).to.exist;

      let conn2 = await lepus.connect();
      expect(conn2).to.exist;

    });

  });

});
