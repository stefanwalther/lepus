const Lepus = require('./../../src');

describe('Connection', () => {

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

    it('fails with wrong connection', () => {
      let lepus = new Lepus('amqp://guest:guest@localhost:1111');
      return expect(lepus.connect()).to.be.rejectedWith(Error);
    }).timeout(500);

  });

  describe('Reuse', () => {
    let lepus = null;
    before(() => {
      lepus = new Lepus();
    });
    after(async () => {
      lepus.disconnect();
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
