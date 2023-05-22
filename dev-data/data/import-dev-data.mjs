// um datenbank mit ersten testdaten zu laden, oder später, um das Programm damit zu testen
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path'; //__dirname is not definet
import { fileURLToPath } from 'url'; //__dirname is not definet

// eslint-disable-next-line node/no-missing-import
import User from '../../models/userModel.mjs';
import MalReport from '../../models/malReportModel.mjs';

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

//(node:9752) [MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitori
// ng engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
mongoose
  //.connect(process.env.DATABASE_MONGODB_LOCAL, {
  .connect(DB, {
    //hosted db cluster
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succeful!'));

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')); //, 'utf-8'
//const tours = JSON.parse(fs.readFil.eSync(`${__dirname}/../dev-data/data/tours-simple.json`))

// READ JSON-file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8')); //, 'utf-8'
const malReports = JSON.parse(
  fs.readFileSync(`${__dirname}/malReports.json`, 'utf-8')
);
const machinery = JSON.parse(
  fs.readFileSync(`${__dirname}/machinery.json`, 'utf-8')
); //, 'utf-8'
const departments = JSON.parse(
  fs.readFileSync(`${__dirname}/departments.json`, 'utf-8')
); //, 'utf-8'

//IMPORT DATA into Database
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await MalReport.create(malReports, { validateBeforeSave: false });
    await Machine.create(machinery, { validateBeforeSave: false });
    await Department.create(departments, { validateBeforeSave: false });
    //await User.create(users, { validateBeforeSave: false }); //gibt validierungsfehler wenn --import     in model turn off passwort bei pre-save 2x //comment this out for import data, nacher wieder rückgänging

    console.log('Data successfully loaded! Test- Daten');
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
    await MalReport.deleteMany();
    await Machine.deleteMany();
    await Department.deleteMany();
    console.log('Data successfully deleted!');
    // eslint-disable-next-line no-process-exit
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// weil --import in terminal (das dritte im array --> [2])
if (process.argv[2] === '--import') {
  //run importData()
  importData();
} else if (process.argv[2] === '--delete') {
  //run deleteData
  deleteData();
}

console.log('process.argv: ' + process.argv);

//zum laufen lassen, neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --import
// (ev muss im userModel gewisse Middleware dafür auskommentiert werden

//zu datenbank löschen: neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --delete

// man sieht in conosle 3 sachen, sollte ein array sein, aber zeigt keine [], das dritte ist --import
