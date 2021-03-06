const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Helper method to validate if the given string contains valid JSON.
 * @param {string} str - The string to validate.
 * @returns {boolean}
 */
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Validator for topology files.
 */
class ValidatorTopology {

  /**
   * Validate the topology file:
   * - The file has to exist
   * - The file has to be either a .yml or a .json file
   *
   * This method does not validate the content of the file.
   *
   * @static
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
   * @param {String} file - Absolute path the the file.
   * @returns {boolean} - Returns true if no error occurred, otherwise will throw the error.
   *
   * @static
   */
  static validateTopologyFileStructure(file) {

    const ext = path.extname(file).toLowerCase();
    switch (ext) {
      case '.js':
        try {
          require(file);
        } catch (e) {
          throw e;
        }
        break;
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
          throw e;
        }
        break;
      default:
        return true;
    }
  }
}

module.exports = ValidatorTopology;
