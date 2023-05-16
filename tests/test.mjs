import * as assert from 'assert';
//const { expect } = require('chai');
import { expect } from 'chai';
//const chaiHttp = require('chai-http');
import chaiHttp from 'chai-http';
import chai from 'chai';

import { sum } from '../app.mjs';
import { getAboutASMA } from '../controllers/viewsController.mjs';
import app from '../app.mjs';

describe('Test the sum method in Test server.mjs', function () {
  it('should return 3 --> (1+2=3)', function () {
    assert.equal(sum(1, 2), 3);
  });
});

describe('getAboutASMA', () => {
  it('should return status code 200', async () => {
    const req = {};
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getAboutASMA(req, res, next);

    expect(res.statusCode).to.equal(200);
  });
});

chai.use(chaiHttp);

describe('GET /aboutASMA', function () {
  this.timeout(15000); // Setze den Timeout auf 15 Sekunden

  it('sollte die Seite erfolgreich rendern', function (done) {
    chai
      .request(app)
      .get('/api/v1/aboutASMA')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
        // Füge hier weitere Assertions hinzu, um den gerenderten Inhalt zu überprüfen

        done();
      });
  });
});
