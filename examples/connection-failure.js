const Lepus = require('./../src');

// Retry behavior is completely disabled
(async () => {
  let lepus = new Lepus('amqp://guest:guest@localhost:1111', {retry_behavior: {enabled: false}});
  await lepus.connect();
  await lepus.disconnect();
})();
