// Todo: Not sure if we should use that, probably better to ignore and remove
const exec = require('child-process-promise').exec;

module.exports.start = () =>
  exec('docker run -d --name=rabbitmq-lepus -p 5672:5672 rabbitmq:3.6; true && ' +
    'docker start rabbitmq-lepus');

module.exports.stop = () => exec('docker stop rabbitmq-lepus');
module.exports.rm = () => exec('docker rm -f rabbitmq-lepus || true');
