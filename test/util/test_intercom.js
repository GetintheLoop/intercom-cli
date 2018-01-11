const path = require('path');
const expect = require("chai").expect;
const nockBack = require('nock').back;
const intercom = require('./../../lib/util/intercom')({
  INTERCOM_TOKEN: 'test-token'
});

describe("Testing Intercom", () => {
  before(() => {
    nockBack.setMode('record');
    nockBack.fixtures = path.join(__dirname, "__cassette");
  });

  // eslint-disable-next-line func-names
  it("Testing User Scrolling", function (done) {
    this.timeout(60000);
    nockBack(`intercom-users-scroll.json`, {}, (nockDone) => {
      intercom.users.scroll((r) => {
        if (r !== null) {
          expect(r.body.users.length).to.be.at.most(100);
        } else {
          nockDone();
          done();
        }
        return Promise.resolve();
      });
    });
  });

  it("Testing User Updating", done => nockBack('intercom-users-update.json', {}, nockDone => intercom.users
    .update({ user_id: '00000000000000000000000000000000', name: 'First Last' })
    .then((result) => {
      expect(result.statusCode).to.equal(200);
      expect(result.body.name).to.equal('First Last');
      nockDone();
      done();
    })));
});
