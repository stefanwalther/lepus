const path = require('path');
const fs = require('fs-extra');

class ValidatorTopology {

  /**
   * Validate the topology file:
   * - The file has to exist
   * - The file has to be either a .yml or a .json file
   *
   * This method does not validate the content of the file.
   */
  static validateTopologyFile(file) {

    const allowedExtensions = ['.yml', '.yaml', '.json', '.js'];
    const exists = fs.existsSync(file);
    if (!exists) {
      throw new Error('File does not exist', file);
    }

    const ext = path.extname(file);
    if (allowedExtensions.indexOf(ext) === -1) {
      throw new Error('Can only be either a .yml, .yaml, .json or .js file', file);
    }
  }

  static validateTopologyContent(/* file */) {

  }

}

module.exports = ValidatorTopology;
