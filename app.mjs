import path from 'path'; //__dirname is not definet
import { fileURLToPath } from 'url'; //__dirname is not definet
import express from 'express';
import morgan from 'morgan';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp'; //verschmutzung in url
import cors from 'cors';
import cookieParser from 'cookie-parser';

//import poolDB from './utils/db.mjs'; // MariaDB....
import User from './models/userModel.mjs'; // MongoDB...

import AppError from './utils/appError.mjs';

import userRoute from './routes/userRoutes.mjs';
import machineRoute from './routes/machineRoutes.mjs';
import viewRoute from './routes/viewRoutes.mjs';
import departmentRoute from './routes/departmentRoutes.mjs';
import malReportRoute from './routes/malReportRoutes.mjs';
import startRoute from './routes/startRoute.mjs';

import globalErrorHandler from './controllers/errorController.mjs'; //globalError..., kann nennen wie man möchte
import testRoute from './routes/testRoute.mjs';

const app = express();

const __filename = fileURLToPath(import.meta.url); //__dirname is not definet
const __dirname = path.dirname(__filename); //__dirname is not definet

//begining of the app
app.set('view engine', 'pug'); //oder ejs
//app.set('view engine', 'ejs'); //oder ejs
//app.set('views', './views/pages'); // aber besser nicht so

//app.set('views', path.join(__dirname, 'views'));
//app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views', 'de'), path.join(__dirname, 'views', 'en')]);
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views', 'de'),
  path.join(__dirname, 'views', 'en'),
]);
// slash /views// mit path, könnte bug geben mit /\- im pfad
// could also be './views', but this is safer
//app.set('views', path.join(__dirname, 'views/pages'));

// Middleware

// 1. GLOBAL MIDDLEWARES

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Serving static files
//um auf html css zuzugreifen, was jedoch eine API nicht macht
//app.use(express.static(`${__dirname}/public`))

//um auf html css zuzugreifen, was jedoch eine API nicht macht
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public'))); //wurde hier plaziert, unter app.set views ORIGINAL
//app.use('/public', express.static(path.join(__dirname, 'public')));

//app.use(express.static('./public'));

// use cors before all route definitions  nicht von tutorial
app.use(cors({ origin: 'http://localhost:4301' }));

// Set securtity HTTP headers
//app.use(helmet()); // sollte hier am anfang der mittdleware stehen,und nicht am schluss   hat mit dem funktioniert, bis jquery

const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      //'cdnjs.cloudflare.com',
      'code.jquery.com',
      'cdn.datatables.net',
    ],
    connectSrc: ["'self'", 'http://127.0.0.1:7566'],
  },
};

app.use(helmet.contentSecurityPolicy(cspOptions));

//nicht von tutorial
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             baseUri: ["'self'"],
//             fontSrc: ["'self'", 'https:', 'data:'],
//             scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.20.0/axios.min.js'],
//             objectSrc: ["'none'"],
//             styleSrc: ["'self'", 'https:', 'unsafe-inline'],
//             upgradeInsecureRequests: [],
//         },
//     })
// );

// fast original
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ['\'self\'', "'unsafe-inline'", 'self', 'unsafe-inline'],
//         baseUri: ["'self'"],
//         fontSrc: ["'self'", 'https:', 'data:'],
//         scriptSrc: ['\'self\'', "'unsafe-inline'", "'unsafe-eval'", 'cdnjs.cloudflare.com', 'code.jquery.com'], //, 'cdn.datatables.net'],
//         connectSrc: ['\'self\'', 'http://localhost:4301', 'http://127.0.0.1:4301'], //, 'http://localhost:4301', 'http://127.0.0.1:4301'
//     },
// }))

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         'cdnjs.cloudflare.com',
//         'code.jquery.com',
//         'cdn.datatables.net',
//       ],
//       connectSrc: ["'self'", 'http://localhost:7566', 'http://172.0.0.1:7566'],
//     },
//   })
// );
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
//         baseUri: ["'self'"],
//         fontSrc: ["'self'", 'https:', 'data:'],
//         scriptSrc: [
//           "'self'",
//           'https:',
//           'http:',
//           'blob:',
//           'https://*.mapbox.com',
//           'https://js.stripe.com',
//           'https://m.stripe.network',
//           'https://*.cloudflare.com',
//         ],
//         frameSrc: ["'self'", 'https://js.stripe.com'],
//         objectSrc: ["'none'"],
//         styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//         workerSrc: [
//           "'self'",
//           'data:',
//           'blob:',
//           'https://*.tiles.mapbox.com',
//           'https://api.mapbox.com',
//           'https://events.mapbox.com',
//           'https://m.stripe.network',
//         ],
//         childSrc: ["'self'", 'blob:'],
//         imgSrc: ["'self'", 'data:', 'blob:'],
//         formAction: ["'self'"],
//         connectSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           'unsafe-eval',
//           //'data:',
//           //'blob:',
//           //'https://*.stripe.com',
//           //'https://*.mapbox.com',
//           //'https://*.cloudflare.com/',
//           //'https://bundle.js:*',
//           'ws://127.0.0.1:*/',
//           //'ws://localhost:*/',
//         ],
//         upgradeInsecureRequests: [],
//       },
//     },
//   })
// );

// das oben würde ev auch so gehen: mit einer middleware
app.use((req, res, next) => {
  res.set('Content-Security-Policy', 'connect-src *');
  next();
});

// *
// Default: `default-src 'self' 'unsafe-inline' data:;` *
//     `script-src 'self' 'unsafe-eval' 'unsafe-inline' data:` *
//     /
// devContentSecurityPolicy ? : string;

// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
//   );

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

// Development logging
console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// // Development logging
// console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV); // wiso ist dieser undefinded? bei server.mjs ist morgan zuoberst und erst dann app
// if (process.env.NODE_ENV === 'development') {
//   // wenn undefined oder development... :)
//   app.use(morgan('dev')); // wenn nicht geht, hat man kein logger!
// }

// Limit request from same API
// global middlewares limiter   für denial-of-service and brute-force- angriffe
const limiter = rateLimit({
  // how many request erlaubt in einer zeit, von der selben ip
  max: 100, // 100 request from the same IP
  windowMS: 60 * 60 * 1000, // window-time MS in miliseconds    1h
  message: 'Too many requests from this IP, please try again in an hour!',
});
//app.use(limiter)
app.use('/api', limiter);

//app.use(express.json()); //für post (daten von client zu bekommen), muss json sein

// Body parser, reading data from body into req.body
//app.use(express.json()) //für post (daten von client zu bekommen), muss json sein
// parst data from body
app.use(express.json({ limit: '100kb' })); // um daten
//parse data coming in a urlencoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // wenn form send data to server, zb ejs method=post input, it also called urlencoded , extendet true, um komplexe daten zu senden, wird aber nicht gebraucht eigentlich
//parse data from cookies
app.use(cookieParser());

// after the bod-parser, Sicherheit für datenbereinigung
// Data sanatisation against NoSQLquery injection

// bsp: bei postman, login als: // oder in compass: {"email": {"$gt": ""}} bei filter, mit {}
// {
//     "email": {"$gt": ""},
//     "password": "newpassword"
// }
app.use(mongoSanitize()); // filtert alle dollarzeichen usw heraus

// after the bod-parser, Sicherheit für datenbereinigung
// Data sanatisation against XSS    cross-site-scriptingAttaks
app.use(xss()); // clean user-input von bösartige html- sachen

// {
//     "email": "tester@jonas.io",
//     "password": "pass1234",
//     "passwordConfirm": "pass1234",
//     "name": "<div id='bad_code'>böse</div>"  --> in postman kommt: "name": "&lt;div id='bad_code'>böse&lt;/div>",
// }

// Prevent parameter prolution  clearup the querystring {{URL}}api/v1/tours?sort=duration&sort=price mit zweimal sort, was nicht geht   benutzt nur noch den letzten sort!
//app.use(hpp()) // wenn deaktiviert, {{URL}}api/v1/tours?duration=5&duration=9 kommen drei ansonsten eine
app.use(
  hpp({
    whitelist: [
      // erlaubt dublicatet in querystring
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price', //{{URL}}api/v1/tours?duration=5&duration=9  muss eingeloggt sein und barer-token    {{URL}}api/v1/tours?sort=duration&sort=price
    ],
  })
);

// Serving static files
//um auf html css zuzugreifen, was jedoch eine API nicht macht
//app.use(express.static(`${__dirname}/public`))
//app.use(express.static(path.join(__dirname, 'public')))

// my middleware
// app.use((req, res, next) => {
//     console.log("Hello from the Mittdleware :)")
//     next()
// })

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(qqq)
  //console.log("app.js, req.headers: " + req.headers) //http-headers, client send  [object, object]
  //console.log(JSON.parse(req.headers)) gibt fehler unexpect token
  // console.log(JSON.stringify(req.headers)) //http://127.0.0.1:4301/api/v1/tours mit value: Authoriazation und Bearer hashirgendwasToken
  // console.log(
  //   'Bin Test middleware: ' + JSON.stringify(req.cookies) + ' ---------'
  // );
  next();
});

// DELETE COOKIE
app.get('/delete-cookie', (req, res) => {
  //DELETING username COOKIE
  res.clearCookie('jwtAdministrator');
  res.clearCookie('jwtEduardo Hernandez');
  res.clearCookie('jwtJonas Schmedtmann');
  res.clearCookie('jwtLaura Wilson');
  res.clearCookie('jwtMax Smith');
  res.clearCookie('jwtjonassssss');
  res.clearCookie('jwtnameCookie5');
  res.clearCookie('jwttester33');
  res.clearCookie('jwtuserCookie5');
  // REDIRECT OT HOME
  res.redirect('/');
});

// my middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware :)');
//   next();
// });

// Routes
// app.get('/', (req, res) => {
//   res.status(200).send('hello from server from app.mjs');
// });

app.get('/m', async (req, res) => {
  try {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'sucsess',
      results: users.length,
      data: {
        users,
      },
      //requestedAt: req.requestTime //,
      // results: tours.length,
      // data: tours //{ tours: tours }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'was ist schief: ' + err,
    });
  }
});

app.get('/d', async (req, res) => {
  console.log('Halloooo from /d');
  let conn;
  try {
    conn = await poolDB.getConnection();
    const rows = await conn.query(
      `SELECT * FROM userVerkaufMubea WHERE ID_User=1;`
    );
    //console.log(rows); //[ {val: 1}, meta: ... ]
    const jsonS = JSON.stringify(rows);
    console.log(jsonS);
    //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
    //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
    res.send(jsonS);
  } catch (err) {
    console.log(
      'DB-Error, irgendwas ist passiert, weil connection limit auf 8??? max 150??? '
    );
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});

// 3. routes    mounting router
// app.get('/', (req, res, ) => {
//         res.status(200).render('base', {
//             tour: 'The Forrest hiker',
//             user: 'Jonas',
//         })
//     })
app.get('/ejs', (req, res) => {
  res.status(200).render('basee');
});

// app.get('/overview', (req, res) => {
//     res.status(200).render('overview', {
//         title: 'All Tours',
//     })
// })

// app.get('/tour', (req, res) => {
//     res.status(200).render('tour', {
//         title: 'The Forrest Hiker Tour',
//     })
// })

// API- Routes
app.use('/api/v1/userstest', testRoute);
app.use('/', startRoute);
app.use('/api/v1', viewRoute); // sollte der erste sein
app.use('/api/v1/departments', departmentRoute);
app.use('/api/v1/machinery', machineRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/malReports', malReportRoute);

//---------------------------unit-test-test----Down--------------------------------
// für UNIT-TEST- Versuch
export function sum(a, b) {
  return a + b;
}
console.log('Für Unit Test... sum: ' + sum(2, 3));

// a_Plus_b(1, 2);
//
// function a_Plus_b(a, b) {
//   let result = a + b;
//   // console.log("UnitTest... a+b= "+ result);
// }
//---------------------------unit-test-test----Up--------------------------------

//um falsche urls eine fehlermeldung zu geben, muss dies unter den routen passieren
// für all, get post put delete--> all      404 for not found
//http://127.0.0.1:4301/api/tours       --> v1 zb nicht in url
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //     status: 'fail',
  //     message: `Can's find ${req.originalUrl} on this server!`
  // })

  //um fehler zu erzeugen, damit error-handling-middleware getestet werden kann
  // const err = new Error(`Can's find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  //next(err); // error übergeben
  next(new AppError(`Can's find ${req.originalUrl} on this server!`, 404));
});

// operation error   --> kann man nicht vorhersagen, zb user falsche url
//                         failed connect server, database
//                         falsche user eingaben
//                  das sind errorhandling in express
//
// programm erros  -->  redeanig undefined
//
//error-handling-Middleware video 115
// app.use((err, req, res, next) => {

//     // stackTrace
//     console.log("err.stack(Trace): " + err.stack);

//     //default error-status-code
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message + ' bin errorHandling-Middleware bei app.js'
//     });
// })

app.use(globalErrorHandler);

export default app;
//export default { sum, app };
