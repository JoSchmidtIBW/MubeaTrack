import path from 'path'; //__dirname is not defined
import { fileURLToPath } from 'url'; //__dirname is not defined
import express from 'express';
import morgan from 'morgan';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp'; // against pollution in url
import cors from 'cors';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError.mjs';

import userRoute from './routes/userRoutes.mjs';
import machineRoute from './routes/machineRoutes.mjs';
import viewRoute from './routes/viewRoutes.mjs';
import departmentRoute from './routes/departmentRoutes.mjs';
import malReportRoute from './routes/malReportRoutes.mjs';
import startRoute from './routes/startRoute.mjs';

import globalErrorHandler from './controllers/errorController.mjs';

const app = express();

const __filename = fileURLToPath(import.meta.url); //__dirname is not definet
const __dirname = path.dirname(__filename); //__dirname is not definet

// Begining of the app
app.set('view engine', 'pug');

app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views', 'de'),
  path.join(__dirname, 'views', 'en'),
]);
// slash /views// in path, can be a bug with /\- path
// could also be './views', but this is safer, app.set('views', path.join(__dirname, 'views/pages'));

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
    scriptSrc: ["'self'", 'code.jquery.com', 'cdn.datatables.net'],
    connectSrc: ["'self'", 'http://127.0.0.1:7566', 'http://127.0.0.1:7577'],
  },
};

app.use(helmet.contentSecurityPolicy(cspOptions));

app.use((req, res, next) => {
  res.set('Content-Security-Policy', 'connect-src *');
  next();
});

// Development logging
console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
// global middlewares limiter   for denial-of-service and brute-force- attacks
const limiter = rateLimit({
  // how many request are allowed in a time, by the same ip
  max: 100, // 100 request from the same IP
  windowMS: 60 * 60 * 1000, // window-time MS in miliseconds  = 1h
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
// parst data from body
app.use(express.json({ limit: '100kb' })); // for POST, to get data from client (need to be json)
// parse data coming in a urlencoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // wenn form send data to server, zb ejs method=post input, it also called urlencoded , extendet true, um komplexe daten zu senden, wird aber nicht gebraucht eigentlich
// parse data from cookies
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

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('Hello from the middleware :)');
  // console.log(JSON.stringify(req.headers));
  // console.log(JSON.stringify(req.cookies));
  next();
});

// DELETE COOKIE
app.get('/delete-cookie', (req, res) => {
  //DELETING username COOKIE
  res.clearCookie('jwtAdministrator');
  res.clearCookie('jwtEduardo Hernandez');
  // REDIRECT TO HOME
  res.redirect('/');
});

// Routes

app.get('/ejs', (req, res) => {
  res.status(200).render('basee');
});

// API- Routes
//app.use('/api/v1/userstest', testRoute);
app.use('/', startRoute);
app.use('/api/v1', viewRoute); // has to be the first
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

// To give an error message for wrong urls, this must happen under the routes
app.all('*', (req, res, next) => {
  // next(err); // error hand over
  // für all Fehler, get post put delete --> all 404 for not found
  next(new AppError(`Can's find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
