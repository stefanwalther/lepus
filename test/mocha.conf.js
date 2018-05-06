const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

process.env.NODE_ENV = 'test';
process.env.WINSTER_SUPRESS_LOGGING = 'true';

chai.use(sinonChai);
chai.use(chaiAsPromised);

global.expect = chai.expect;
