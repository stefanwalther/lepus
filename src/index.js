const amqp = require('amqplib');

let _connection = null;

class Lepus {

  constructor(connectionConfig, opts) {
    this.connectionConfig = connectionConfig || 'amqp://guest:guest@localhost:5672';
    this.opts = opts;
  }

  get Connection() {
    return _connection;
  }

  connect() {

    return new Promise((resolve, reject) => {
      if (_connection) {
        console.log('reuse connection');
        return resolve(_connection);
      }
      return amqp.connect(this.connectionConfig)
        .then(conn => {
          _connection = conn;
          resolve(_connection);
        })
        .catch(err => reject(err));
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
