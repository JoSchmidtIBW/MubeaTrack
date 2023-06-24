import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

import {
  getAboutASMA,
  getContact,
  getContactInlogt,
  getAboutMubeaTrackInlogt,
  getAboutASMAInlogt,
  getAccount,
  getASMAMachine,
  getOverviewDepartment,
  getUpdateMalReport,
  getStart,
  getMyMalReports,
  getLoginForm,
} from '../controllers/viewsController.mjs';

chai.should();

describe('Contact- Page Rendering Tests', () => {
  it('Should render the contact- page with the correct title: MT | Contact', async () => {
    const res = await chai //req.user.language === 'de'
      .request('http://127.0.0.1:' + process.env.DEV_PORT)
      .get('/api/v1/contact')
      .send();

    const title = res.text.match(/<title>(.*?)<\/title>/)[1];

    expect(title).to.equal('MT | Contact');
  });
});

describe('getContactInlogt', () => {
  it('should return status code 200 when user language is "de"', async () => {
    const req = {
      user: {
        language: 'de',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getContactInlogt(req, res, next);

    expect(res.statusCode).to.equal(200);
  });

  it('should return status code 200 when user language is not "de"', async () => {
    const req = {
      user: {
        language: 'en',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getContactInlogt(req, res, next);

    expect(res.statusCode).to.equal(200);
  });
});

describe('AboutMubeaTrack- Page Rendering Tests', () => {
  it('Should render the aboutMubeaTrack- page with the correct title: MT | About MubeaTrack', async () => {
    const res = await chai
      .request('http://127.0.0.1:' + process.env.DEV_PORT)
      .get('/api/v1/aboutMubeaTrack')
      .send();

    const title = res.text.match(/<title>(.*?)<\/title>/)[1];
    //
    expect(title).to.equal('MT | About MubeaTrack');
  });
});

describe('getAboutMubeaTrackInlogt', () => {
  it('should return status code 200 when user language is "de"', async () => {
    const req = {
      user: {
        language: 'de',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getAboutMubeaTrackInlogt(req, res, next);

    expect(res.statusCode).to.equal(200);
  });

  it('should return status code 200 when user language is not "de"', async () => {
    const req = {
      user: {
        language: 'en',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getAboutMubeaTrackInlogt(req, res, next);

    expect(res.statusCode).to.equal(200);
  });
});

describe('AboutASMA- Page Rendering Tests', () => {
  it('Should render the aboutASMA- page with the correct title: MT | About ASMA', async () => {
    const res = await chai
      .request('http://127.0.0.1:' + process.env.DEV_PORT)
      .get('/api/v1/aboutASMA')
      .send();

    const title = res.text.match(/<title>(.*?)<\/title>/)[1];
    //
    expect(title).to.equal('MT | About ASMA');
  });
});

describe('getAboutASMAInlogt', () => {
  it('should return status code 200 when user language is "de"', async () => {
    const req = {
      user: {
        language: 'de',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getAboutASMAInlogt(req, res, next);

    expect(res.statusCode).to.equal(200);
  });

  it('should return status code 200 when user language is not "de"', async () => {
    const req = {
      user: {
        language: 'en',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getAboutASMAInlogt(req, res, next);

    expect(res.statusCode).to.equal(200);
  });
});

describe('getAccount', () => {
  it('should return status code 200 when user language is "de"', async () => {
    const req = {
      user: {
        language: 'de',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getAccount(req, res, next);

    expect(res.statusCode).to.equal(200);
  });

  it('should return status code 200 when user language is not "de"', async () => {
    const req = {
      user: {
        language: 'en',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getAccount(req, res, next);

    expect(res.statusCode).to.equal(200);
  });
});

describe('Start- Page Rendering Button Show next Joke', () => {
  it('Should render the button: Show next Joke', async () => {
    const res = await chai
      .request('http://127.0.0.1:' + process.env.DEV_PORT)
      .get('/')
      .send();

    expect(res.text).to.include('Show next joke');
  });
});

describe('getStart', () => {
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

    await getStart(req, res, next);

    expect(res.statusCode).to.equal(200);
  });
});

describe('getLoginForm', () => {
  it('should return status code 200', async () => {
    const req = {
      user: {
        language: 'de',
      },
    };
    const res = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      render: function () {},
    };
    const next = function () {};

    await getLoginForm(req, res, next);

    expect(res.statusCode).to.equal(200);
  });
});

describe('Login- Page Rendering Tests', () => {
  it('Should render the login- page with the correct title: MT | Log into your account', async () => {
    const res = await chai
      .request('http://127.0.0.1:' + process.env.DEV_PORT)
      .get('/api/v1/login')
      .send();

    const title = res.text.match(/<title>(.*?)<\/title>/)[1];
    //
    expect(title).to.equal('MT | Log into your account');
  });
});
