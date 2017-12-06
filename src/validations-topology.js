const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

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

  /**
   * Validate the structure of the topology file.
   *
   * Note: This will not validate the content.
   *
   * @param file
   * @returns {boolean}
   */
  static validateTopologyFileStructure(file) {

    const ext = path.extname(file).toLowerCase();
    switch (ext) {
      case '.json':
        if (!isJson(fs.readFileSync(file))) {
          throw new Error('Invalid JSON file');
        }
        break;
      case '.yml':
      case '.yaml':
        try {
          yaml.safeLoad(fs.readFileSync(file, 'utf8'));
        } catch (e) {
          console.log(e);
          throw e;
        }
        break;
      default:
        return true;
    }
  }

}

module.exports = ValidatorTopology;
