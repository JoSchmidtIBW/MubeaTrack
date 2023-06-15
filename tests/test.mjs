import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
//import * as assert from 'assert';
//const { expect } = require('chai');
import { expect } from 'chai';
//const chaiHttp = require('chai-http');
//import chaiHttp from 'chai-http';
import chai from 'chai';
//import chaiHttp from 'chai-http';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

//import { sum } from '../app.mjs';
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

import { getMachineryASMA } from '../controllers/machineController.mjs';
// import app from '../app.mjs';
//
// import sinon from 'sinon';

chai.should();
// chai.use(chaiHttp);

// describe('Test the sum method in Test server.mjs', function () {
//   it('should return 3 --> (1+2=3)', function () {
//     assert.equal(sum(1, 2), 3);
//   });
// });

describe('Contact- Page Rendering Tests', () => {
  it('Should render the contact- page with the correct title: MT | Contact', async () => {
    const res = await chai //req.user.language === 'de'
      .request('http://127.0.0.1:' + process.env.DEV_PORT) //http://127.0.0.1:7566/api/v1/contactInlogt
      .get('/api/v1/contact')
      .send();

    // console.log(req);

    //console.log(res);
    // console.log(res.text);
    // console.log(req.user.language);
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.headers);
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
    //console.log(res.data);
    // const title = res.text.match(/<title>(.*?)<\/title>/)[1];
    // //
    // // // Überprüfen Sie den Title
    // expect(title).to.equal('MT | Kontakt');
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
    const res = await chai //req.user.language === 'de'
      .request('http://127.0.0.1:' + process.env.DEV_PORT) //http://127.0.0.1:7566/api/v1/contactInlogt
      .get('/api/v1/aboutMubeaTrack')
      .send();

    // console.log(req);

    //console.log(res);
    // console.log(res.text);
    // console.log(req.user.language);
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.headers);

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

    // console.log(req);

    //console.log(res);
    //console.log(res.text);
    // console.log(req.user.language);
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.headers);

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

    // console.log(req);

    //console.log(res);
    //console.log(res.text);
    // console.log(req.user.language);
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.headers);

    //const title = res.text.match(/<title>(.*?)<\/title>/)[1];
    // //
    //expect(title).to.equal('Start');
    //expect(response.text).to.include('Show next joke');
    //if (match) {
    //const title = match[0];
    expect(res.text).to.include('Show next joke');
    //} else {
    //  throw new Error('Title not found in response text');
    //}
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

    // console.log(req);

    //console.log(res);
    //console.log(res.text);
    // console.log(req.user.language);
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req.headers);

    const title = res.text.match(/<title>(.*?)<\/title>/)[1];
    //
    expect(title).to.equal('MT | Log into your account');
  });
});

// describe('getMyMalReports', () => {
//   it('should return status code 200', async () => {
//     const req = {
//       user: {
//         language: 'de',
//         role: 'admin',
//       },
//       cookies: {
//         jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2MxZjA0MmRmMDMyMWNiOGEwNmE0NyIsImlhdCI6MTY4NjY5MjA0MSwiZXhwIjoxNjk0NDY4MDQxfQ.l553U8E-_M4Pv82tQLoGv4KYUv9EnDrBSf_dI2EE5Rg',
//       },
//     };
//
//     const res = {
//       status: function (statusCode) {
//         this.statusCode = statusCode;
//         return this;
//       },
//       render: function () {},
//     };
//     const next = function () {};
//
//     await getMyMalReports(req, res, next);
//
//     expect(res.statusCode).to.equal(200);
//   });
// });

// describe('getMachineryASMA', () => {
//   it('should return status code 200', async () => {
//     const req = {
//       user: {
//         language: 'de',
//       },
//     };
//     const res = {
//       status: function (statusCode) {
//         this.statusCode = statusCode;
//         return this;
//       },
//       render: function () {},
//     };
//     const next = function () {};
//
//     await getMachineryASMA(req, res, next);
//
//     expect(res.statusCode).to.equal(200);
//   });
// });

// describe('getUpdateMalReport', () => {
//   it('should return status code 200 when user language is "de"', async () => {
//     const req = {
//       user: {
//         language: 'de',
//       },
//     };
//     const res = {
//       status: function (statusCode) {
//         this.statusCode = statusCode;
//         return this;
//       },
//       render: function () {},
//     };
//     const next = function () {};
//
//     await getUpdateMalReport(req, res, next);
//
//     expect(res.statusCode).to.equal(200);
//   });
//
//   it('should return status code 200 when user language is not "de"', async () => {
//     const req = {
//       user: {
//         role: 'admin',
//         language: 'en',
//       },
//       cookies: {
//         jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2MxZjA0MmRmMDMyMWNiOGEwNmE0NyIsImlhdCI6MTY4NjY5MjA0MSwiZXhwIjoxNjk0NDY4MDQxfQ.l553U8E-_M4Pv82tQLoGv4KYUv9EnDrBSf_dI2EE5Rg',
//       },
//     };
//     const res = {
//       status: function (statusCode) {
//         this.statusCode = statusCode;
//         return this;
//       },
//       render: function () {},
//     };
//     const next = function () {};
//
//     await getUpdateMalReport(req, res, next);
//
//     expect(res.statusCode).to.equal(200);
//   });
// });

//chai.use(chaiHttp);
