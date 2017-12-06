const validator = require('./../../src/validations-topology');
const path = require('path');

describe('UNIT => Topology', () => {

  describe('verification of the input file', () => {
    const basePath = path.join(__dirname, './../fixtures/topologies/dummy');
    it('fails if not a .yml or .json file', () => {
      const file = path.resolve(path.join(basePath, 'basic.txt'));
      expect(() => validator.validateTopologyFile(file)).to.throw('Can only be either a .yml, .yaml, .json or .js file');
    });
    it('fails if file is not existing', () => {
      const file = path.resolve(path.join(basePath, 'does-not-exist.txt'));
      expect(() => validator.validateTopologyFile(file)).to.throw('File does not exist');
    });
    it('succeeds if a .yml file', () => {
      const file = path.resolve(path.join(basePath, 'basic.yml'));
      expect(() => validator.validateTopologyFile(file)).to.not.throw();
    });
    it('succeeds if a .yaml file', () => {
      const file = path.resolve(path.join(basePath, 'basic.yaml'));
      expect(() => validator.validateTopologyFile(file)).to.not.throw();
    });
    it('succeeds if a .json file', () => {
      const file = path.resolve(path.join(basePath, 'basic.json'));
      expect(() => validator.validateTopologyFile(file)).to.not.throw();
    });
    it('succeeds if a .js file', () => {
      const file = path.resolve(path.join(basePath, 'basic.js'));
      expect(() => validator.validateTopologyFile(file)).to.not.throw();
    });
  });

  describe('verification of the input file\'s structure', () => {
    const basePath = path.join(__dirname, './../fixtures/topologies/file-content');
    it('throws an error if not a valid json document', () => {
      const file = path.resolve(path.join(basePath, 'json-invalid.json'));
      expect(() => validator.validateTopologyFileStructure(file)).to.throw('Invalid JSON file');
    });
    it('passes if a valid json document', () => {
      const file = path.resolve(path.join(basePath, 'json-valid.json'));
      expect(() => validator.validateTopologyFileStructure(file)).to.not.throw();
    });
    it('throws an error if not a valid yaml file', () => {
      const file = path.resolve(path.join(basePath, 'yaml-invalid.yaml'));
      expect(() => validator.validateTopologyFileStructure(file)).to.throw();
    });
    it('throws an error if not a valid yml file', () => {
      const file = path.resolve(path.join(basePath, 'yml-invalid.yml'));
      expect(() => validator.validateTopologyFileStructure(file)).to.throw();
    });
    it('passes if a valid yaml file', () => {
      const file = path.resolve(path.join(basePath, 'yaml-valid.yaml'));
      expect(() => validator.validateTopologyFileStructure(file)).to.not.throw();
    });
    it('passes if a valid yml file', () => {
      const file = path.resolve(path.join(basePath, 'yml-valid.yml'));
      expect(() => validator.validateTopologyFileStructure(file)).to.not.throw();
    });
    it('throw an error if not matching the scheme');
  });

});
