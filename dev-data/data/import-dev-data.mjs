// um datenbank mit ersten testdaten zu laden, oder später, um das Programm damit zu testen
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path'; //__dirname is not definet
import { fileURLToPath } from 'url'; //__dirname is not definet

// eslint-disable-next-line node/no-missing-import
import User from '../../models/userModel.mjs';
import Tour from '../../models/tourModel.mjs';
import Machine from '../../models/machineModel.mjs';
import Department from '../../models/departmentModel.mjs';

import dotenv, { config } from 'dotenv';

//console.log(process.env);
// use thie before const DB to check file is accessible

const __filename = fileURLToPath(import.meta.url); //__dirname is not definet
const __dirname = path.dirname(__filename); //__dirname is not definet

//dotenv.config({ path: './config.env' });//original
//dotenv.config({ path: '../config.env' });
dotenv.config({ path: './config.env' });

//https://stackoverflow.com/questions/61949483/error-typeerror-cannot-read-property-replace-of-undefined

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
mongoose
  //.connect(process.env.DATABASE_MONGODB_LOCAL, {
  .connect(DB, {
    //hosted db cluster
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection succeful!'));

// READ JSON-file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8')); //, 'utf-8'
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')); //, 'utf-8'
const machines = JSON.parse(
  fs.readFileSync(`${__dirname}/machines.json`, 'utf-8')
); //, 'utf-8'
const departments = JSON.parse(
  fs.readFileSync(`${__dirname}/departments.json`, 'utf-8')
); //, 'utf-8'
//const tours = JSON.parse(fs.readFil.eSync(`${__dirname}/../dev-data/data/tours-simple.json`))

//IMPORT DATA into Database
const importData = async () => {
  try {
    await Tour.create(tours);

    await Department.create(departments, { validateBeforeSave: false });
    await User.create(users, { validateBeforeSave: false }); //gibt validierungsfehler wenn --import     in model turn off passwort bei pre-save 2x //comment this out for import data, nacher wieder rückgänging
    await Machine.create(machines, { validateBeforeSave: false });

    console.log('Data successfully loaded! Test- Daten, zum DB erstellen');
    // eslint-disable-next-line no-process-exit
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all the data / Collection, who are there before
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Tour.deleteMany();
    await Machine.deleteMany();
    await Department.deleteMany();
    console.log(
      'Data successfully deleted! TestDatanbank wurde geleert, um sie mit testdaten zu füllen zu können'
    );
    // eslint-disable-next-line no-process-exit
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// weil --import in terminal (das dritte im array --> 2)
if (process.argv[2] === '--import') {
  //run importData()
  importData();
} else if (process.argv[2] === '--delete') {
  //run deleteData
  deleteData();
}

console.log('process.argv: ' + process.argv);

//zum laufen lassen, neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --import
// man sieht in conosle 3 sachen, sollte ein array sein, aber zeigt keine [], das dritte ist --import

//zu datenbank löschen: neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --delete
