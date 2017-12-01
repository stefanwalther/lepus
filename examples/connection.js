const Lepus = require('./../src');

(async () => {
  let lepus = new Lepus();
  await lepus.connect();
  await lepus.disconnect();
})();


