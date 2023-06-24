import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import mongoose from 'mongoose';

import app from './app.mjs';

// Könnte zum Projektschluss entkommentiert werden. (Jedoch sieht man dann nicht, wo genau der Fehler liegt!)
// process.on('uncaughtException', err => {
//     console.log('UNCAUGHT EXCEPTION! Shutting down...')
//     console.log("Beendige den Prozess...");
//     console.log("--> err.name: " + err.name + " , err.message: " + err.message);
//     // server.close(() => { // damit server noch alle request verarbeiten kann, nicht aprupt schliesst
//     //     process.exit(1); //0 for success, 1 uncalled subjection
//     // }); //server hier nicht definiert, aber hier auch kein server fehler
//     process.exit(1);
// });

//try {
const DB = process.env.DATABASE_MONGODB.replace(
  '<PASSWORD>',
  process.env.DATABASE_MONGODB_PASSWORD
);
//} catch (err) {
//  console.log('keine Internet- Verbindung?');
//}

try {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection succeful!'));
} catch (err) {
  console.log('ERROR DB-Connecting');
  console.log(
    '******************************************************************'
  );
  console.log(
    'Etwas mit MongoDB ging schief. Bin server.mjs, bin 2te funktion'
  );
  console.log(
    '... wahrscheinlich auf MongoDB Atlas und auf --> Add Current IP Adress'
  );
  console.log(
    '******************************************************************'
  );
}

console.log('app.get("env"): ' + app.get('env'));

// 4. start server
let PORT = 7555;
if (process.env.NODE_ENV === 'development') {
  PORT = process.env.DEV_PORT;
} else if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PROD_PORT;
} else {
  PORT = 7555;
}

const server = app.listen(PORT, () => {
  // console.log(`App running on port ${PORT} ...`);
  // console.log(
  //   `Server running on port: http://localhost:${PORT} ...in Browser with no cookie, (nicht https)`
  // );
  console.log(
    `Server running on port: http://127.0.0.1:${PORT} ...in Browser with cookie, (nicht https)`
  );
});

// Könnte zum Projektschluss entkommentiert werden. (Jedoch sieht man dann nicht, wo genau der Fehler liegt!)
// process.on('unhandledRejection', (err) => {
//   console.log(
//     'Etwas ist unvorhersehbar passiert: err.name: ' +
//       err.name +
//       ' , err.message: ' +
//       err.message
//   );
//   console.log('UNHANDLER REJECTION! Shutting down...');
//   console.log('Beendige den Prozess...');
//   server.close(() => {
//     // damit server noch alle request verarbeiten kann, nicht aprupt schliesst
//     // eslint-disable-next-line no-process-exit
//     process.exit(1); //0 for success, 1 uncalled subjection
//   });
// });

export default app;
