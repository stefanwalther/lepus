const amqp = require('amqplib');
const promiseRetry = require('promise-retry');
const _ = require('lodash');
const logger = require('winster').instance();

let _connection = null;

/**
 * RabbitMQ Server definition.
 *
 * @typedef {string|object} rabbitConnectionDef - Connection string of the server.
 */

/**
 * Options
 *
 * @typedef {object} options
 * @param {retry_behavior} retry_behavior - Behavior how to retry connecting to the server in case of failure.
 */

/**
 * Retry behavior in case RabbitMQ is not available.
 *
 * @typedef {object} retry_behavior
 *
 * @property {number} retries - The maximum amount of times to retry the operation. Defaults to 10.
 *
 * @property {boolean} enabled - Whether retry is enabled at all or not (defaults to true); setting to false is equal to keeping {@link retry_behavior} empty.
 * @property {number} interval - Interval in ms.
 * @property {number} times - Amount of times the given operation should be retried.
 * @readonly
 * @property {number} attempts - Readonly, current amount of attempts.
 */

class Lepus {

  /**
   *
   * @param {rabbitConnectionDef} connectionConfig - Connection string or object to define the connection to RabbitMQ.
   * @param {options} opts - Various options.
   */
  constructor(connectionConfig, opts = {}) {
    this.connectionConfig = connectionConfig || 'amqp://guest:guest@localhost:5672';
    this.opts = opts;
    if (!opts.retry_behavior) {
      opts.retry_behavior = require('./config/retry-behavior');
    }

  }

  get Connection() {
    return _connection;
  }

  connect() {

    let opts = _.clone(this.opts);
    return promiseRetry((retry, number) => {

      opts.retry_behavior.attempts = number;
      if (number >= 2 && opts.retry_behavior.enabled) {
        logger.verbose(`Trying to (re)connect to RabbitMq, attempt number ${number - 1}`);
      }
      return amqp.connect(this.connectionConfig)
        .then(conn => {
          _connection = conn;
          return _connection;
        })
        .catch(err => {
          if (number < 2 || (number > 2 && opts.retry_behavior.enabled)) {
            retry();
          } else {
            return Promise.reject(err);
          }
        });
    });
  }

  async disconnect() {
    if (_connection) {
      await _connection.close();
      _connection = null;
    }
  }

  publishMessage() {

  }

  subscribeMessage() {

  }

}

module.exports = Lepus;
