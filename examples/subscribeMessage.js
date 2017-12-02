const Lepus = require('./../src');

(async () => {
  let lepus = new Lepus();

  let opts = {
    exchange: {
      type: 'topic',
      name: 'test'
    },
    key: 'test-key',
    queue: {
      name: 'test-key-queue'
    }
  };
  await lepus.subscribeMessage(opts, async (msgContent, msgRaw) => {
    console.log('msgContent', msgContent);
    console.log('msgRaw.fields', msgRaw.fields);
  });

  // await lepus.disconnect();
})();
