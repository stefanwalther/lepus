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
 * @typedef {object} lepusOptions
 * @property {RetryBehavior} retry_behavior - Behavior how to retry connecting to the server in case of failure.
 */

/**
 * Retry behavior in case RabbitMQ is not available.
 *
 * @typedef {object} RetryBehavior
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
   * @param {lepusOptions} lepusOpts - Various options.
   */
  constructor(connectionConfig, lepusOpts = {}) {
    this.connectionConfig = connectionConfig || 'amqp://guest:guest@localhost:5672';
    this.opts = lepusOpts;
    if (!lepusOpts.retry_behavior) {
      lepusOpts.retry_behavior = require('./config/retry-behavior');
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

   * @return {Promise} - Returns the promise as defined for amqplib.connect.
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
   *
   * @description The cached connection will be destroyed.
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
   * @typedef {object} ExchangeOptions
   * @param {string} type - 'topic', 'direct'
   * @param {string} name - Name of the exchange.
   * @param {object?} argument - Misc arguments for the exchange.
   */

  /**
   * Post a message to RabbitMq.
   *
   * @param {object} opts - Configuration to use to publish a message.

   * @param {ExchangeOptions} opts.exchange - Information about the exchange.
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
   * @typedef {object} QueueOptions - Options for the queue.
   * @property {string} name - Name of the queue.
   */

  /**
   * Subscribe to a message.
   *
   * @param {object} opts - Options to pass in.
   * @param {function} fn - Function to resolve for every message.
   *
   * @param {ExchangeOptions} opts.exchange - Information about the exchange.
   * @param {QueueOptions} opts.queue - Information about the queue.
   *
   * @param {string} opts.key - The routing-key.
   *
   *
   * @returns {Promise}
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
