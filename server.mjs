import dotenv from 'dotenv';
dotenv.config({ path: './config.env' }); //muss nur hier definiert werden    und oben stehen hier!!//

import mongoose from 'mongoose';

import app from './app.mjs';

//mongoose.connect();
const DB = process.env.DATABASE_MONGODB.replace(
  '<PASSWORD>',
  process.env.DATABASE_MONGODB_PASSWORD
);
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     console.log(con.connections), console.log('DB connection succeful!');
//   });

//mongoose.connect(mongoConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose
  //.connect(process.env.DATABASE_MONGODB_LOCAL, {
  .connect(DB, {
    //hosted db cluster
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succeful!'));//.catch(err => console.log('ERROR DB-Connecting'))

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: [true, 'A Tour must have a name'], //validator
    unique: true, // nicht zwei mit selben Namen
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a Price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema); //grossgeschrieben

const testTour = new Tour({
  name: 'The Mubea Caaxeeeeceeeecaaaaaamper',
  price: 99.97,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc); //////////
  })
  .catch((err) => {
    console.log('ERROR doc save... : ', err);
  });

console.log('app.get("env"): ' + app.get('env'));
//console.log(process.env);

let PORT = 7555; // = process.env.DEV_PORT || 7555;
if (process.env.NODE_ENV === 'development') {
  PORT = process.env.DEV_PORT;
} else if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PROD_PORT;
} else {
  PORT = 7555;
}

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
  console.log(`Server running on port: http://localhost:${PORT}...`);
  console.log(`Server running on port: http://127.0.0.1:${PORT}...`);
});

//vercel test
export default app; // "type": "module",

process.on('unhandledRejection', (err) => {
  console.log(
    'Etwas ist unvorhersehbar passiert: err.name: ' +
      err.name +
      ' , err.message: ' +
      err.message
  );
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log('Beendige den Prozess...');
  server.close(() => {
    // damit server noch alle request verarbeiten kann, nicht aprupt schliesst
    // eslint-disable-next-line no-process-exit
    process.exit(1); //0 for success, 1 uncalled subjection
  });
});
