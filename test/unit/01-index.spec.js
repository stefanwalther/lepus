const Lepus = require('./../../src');

describe('Unit Tests => interface', () => {

  let lepus = null;
  beforeEach(() => {
    lepus = new Lepus();
  });

  describe('lepus => check private functions', () => {
    it('should contain a method connect', () => {
      expect(lepus).to.have.a.property('connect').to.be.a('function');
    });
    it('should contain a method publishMessage', () => {
      expect(lepus).to.have.a.property('publishMessage').to.be.a('function');
    });
    it('should contain a method subscribeMessage', () => {
      expect(lepus).to.have.a.property('subscribeMessage').to.be.a('function');
    });
  });
});
