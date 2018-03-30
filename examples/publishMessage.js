const Lepus = require('./../src');

(async () => {
  let lepus = new Lepus();

  let publishOpts = {
    exchange: {
      type: 'topic',
      name: 'test'
    },
    key: 'test-key',
    payload: {
      foo: 'bar',
      bar: 'baz',
      date: new Date()
    },
    options: {}
  };

  for (let i = 0; i < 1000; i++) {
    await lepus.publishMessage(publishOpts);
  }

  await lepus.disconnect();
})();

