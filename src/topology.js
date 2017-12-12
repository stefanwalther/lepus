const validator = require('./validations-topology');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Topologies.
 */
class Topology {

  constructor(file) {
    this.file = null;
    this.topology = null;
    this.load(file);
  }

  /**
   * Exchanges as defined in the topology file.
   *
   * @returns {*}
   */
  get exchanges() {
    if (this.topology && this.topology.exchanges) {
      return this.topology.exchanges;
    }
    return null;

  }

  get topics() {
    if (this.topology && this.topology.topics) {
      return this.topology.topics;
    }
    return null;

  }

  /**
   * Queues (flattened) as defined in the topology file.
   *
   * @returns {*}
   */
  get queues() {
    if (this.topology && this.topology.queues) {
      return this.topology.queues;
    }
    return null;

  }

  /**
   * Load the topology file and return a topology class.
   * Runs all validations first.
   * The file can either be a valid yml or json file.
   *
   * @param {String} file - The absolute path to the file containing the topology (can be either a .json or a .yml/.yaml file)
   */
  load(file) {
    this._validate(file);
    this.file = file;
    let t = this._getFileContent(this.file);
    if (t) { // Only assign if not undefined (js-yaml) or null
      this.topology = t;
    }
  }

  _addPrototypes() {

    if (this.topology) {

      if (this.topology.exchanges) {

        // This.topology.exchanges.prototype.byId = () => {
        //   return _.filter()
        // }

      }
    }
  }

  /**
   * Get the content of the file.
   *
   * @param {String} file - The absolute path to the file.
   * @returns {Object} - The files content as object.
   *
   * @private
   */
  _getFileContent(file) {

    const ext = path.extname(file).toLowerCase();
    switch (ext) {
      case '.js':
      case '.json':
        return fs.readFileSync(file, 'utf8');
      case '.yml':
      case '.yaml':
        return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
      default:
        return null;
    }
  }

  /**
   * Validate the topology file.
   *
   * Just throws the errors of the validators ...
   */
  _validate(file) {
    validator.validateTopologyFile(file);
    validator.validateTopologyFileStructure(file);
  }

}

module.exports = Topology;
