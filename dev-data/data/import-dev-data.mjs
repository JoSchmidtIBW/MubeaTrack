// To load the database with test-data
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
// use this before const DB to check file is accessible

//https://stackoverflow.com/questions/61949483/error-typeerror-cannot-read-property-replace-of-undefined
const __filename = fileURLToPath(import.meta.url); //__dirname is not definet
const __dirname = path.dirname(__filename); //__dirname is not definet

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_MONGODB.replace(
  '<PASSWORD>',
  process.env.DATABASE_MONGODB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succeful!'));

// READ JSON-file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const malReports = JSON.parse(
  fs.readFileSync(`${__dirname}/malReports.json`, 'utf-8')
);
const machinery = JSON.parse(
  fs.readFileSync(`${__dirname}/machinery.json`, 'utf-8')
);
const departments = JSON.parse(
  fs.readFileSync(`${__dirname}/departments.json`, 'utf-8')
);

//IMPORT DATA into Database
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await MalReport.create(malReports, { validateBeforeSave: false });
    await Machine.create(machinery, { validateBeforeSave: false });
    await Department.create(departments, { validateBeforeSave: false });

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

// Because --import in terminal, the third in array --> [2]
if (process.argv[2] === '--import') {
  //run importData()
  importData();
} else if (process.argv[2] === '--delete') {
  //run deleteData
  deleteData();
}

console.log('process.argv: ' + process.argv);

// // to run Database:
// // to fill database with test data:
// // new terminal and input: node .\dev-data\data\import-dev-data.mjs --import
// // to delete the database:
// // new terminal and input: node .\dev-data\data\import-dev-data.mjs --delete
