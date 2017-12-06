const Lepus = require('./../../src');

describe('UNIT => interface', () => {

  let lepus = null;
  beforeEach(() => {
    lepus = new Lepus();
  });

  describe('lepus => check public methods', () => {
    it('should contain a method connect', () => {
      expect(lepus).to.have.a.property('connect').to.be.a('function');
    });
    it('should contain a method disconnect', () => {
      expect(lepus).to.have.a.property('disconnect').to.be.a('function');
    });
    it('should contain a method publishMessage', () => {
      expect(lepus).to.have.a.property('publishMessage').to.be.a('function');
    });
    it('should contain a method subscribeMessage', () => {
      expect(lepus).to.have.a.property('subscribeMessage').to.be.a('function');
    });
  });
});
