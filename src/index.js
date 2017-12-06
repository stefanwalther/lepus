const amqp = require('amqplib');
const promiseRetry = require('promise-retry');
const _ = require('lodash');
const logger = require('winster').instance();

function encode(doc) {
  return new Buffer(JSON.stringify(doc));
}

let _connection = null;
const LOG_DETAIL = false;

/**
 * RabbitMQ Server definition.
 *
 * Note: passing the Connection definition as an object is not supported, yet.
 *
 * @typedef {string} rabbitConnectionDef - Connection string of the server.
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

/**
 * @class Lepus
 */
class Lepus {

  /**
   * Constructor
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

  /**
   * Connect to RabbitMQ.
   *
   * Very similar to amqp.connect, but with the big difference, that if the connection
   * fails, the operation will retry as defined in opts.retry_behavior.
   *
   * Furthermore, in case there is already an existing connection available, this will be returned.
   * No new connection will be established.
   *
   * @param {rabbitConnectionDef} connOpts.server - Connection information for the server.
   * @param {retry_behavior} connOpts.retry_behavior - Retry behavior for establishing the connection.
   *
   * @return {Promise} - Returns the promise as defined for amqplib.connect
   */
  connect() {

    if (_connection) {
      return Promise.resolve(_connection);
    }

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

  /**
   * Disconnect from the server.
   * The cached connection will be destroyed.
   *
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (_connection) {
      await _connection.close();
      _connection = null;
    }
  }

  /**
   * Post a message to RabbitMq.
   *
   * @param {object} opts - Configuration to use to publish a message.

   * @param {object} opts.exchange - Information about the exchange.
   * @param {string} opts.exchange.type - 'topic', 'direct'
   * @param {string} opts.exchange.name - Name of the exchange.
   * @param {object?} opts.exchange.argument - Misc arguments for the exchange.
   *
   * @param {string} opts.key - Key to publish the message.

   * @param {object?} opts.payload - The message to post.

   * @param {object?} opts.options - Options to publish.

   * @param {string?} opts.correlationId - RabbitMQ's correlationId.
   *
   * @returns {Promise}
   */
  async publishMessage(opts) {

    let conn = await this.connect();
    let channel = await conn.createChannel();

    await channel.assertExchange(opts.exchange.name, opts.exchange.type, opts.exchange.arguments);
    await channel.publish(opts.exchange.name, opts.key, encode(opts.payload), opts.options);

    logger.verbose(` [x] Sent key "${opts.key}": ${JSON.stringify(opts.payload, null)}`);

    await channel.close();
  }

  /**
   *
   * @param {object} opts
   * @returns {Promise<void>}
   */
  async subscribeMessage(opts, fn) {

    let conn = await this.connect();
    let channel = await conn.createChannel();
    await channel.assertExchange(opts.exchange.name, opts.exchange.type, opts.exchange.arguments);
    await channel.assertQueue(opts.queue.name, {exclusive: false});
    await channel.bindQueue(opts.queue.name, opts.exchange.name, opts.key);

    await channel.consume(opts.queue.name, msgRaw => {

      const msgContent = JSON.parse(msgRaw.content.toString());
      if (LOG_DETAIL) {
        logger.trace(`[AMQP][subscribe] ${opts.exchange.name}:${opts.queue.name}`, msgContent);
      }

      if (fn) {
        fn(msgContent, msgRaw)
          .then(() => {
            logger.trace(`[AMQP] ack => ${opts.queue.name}`);
            return channel.ack(msgRaw); // Closing the channel is handled by ack()
          })
          .catch(err => {
            logger.trace(`[AMQP] nack => ${opts.queue.name}`, err);
            return channel.nack(msgRaw); // Closing the channel is handled by nack()
          });
      }
    }, {noAck: false});

    // Await channel.close();

  }

}

module.exports = Lepus;
