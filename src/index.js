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

    return new Promise(resolve => {
      if (_connection) {
        return resolve(_connection);
      } 
      // Console.log('connect');
      return amqp.connect(this.connectionConfig)
        .then(conn => {
          // Console.log('reuse connection');
          _connection = conn;
          resolve(_connection);
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
