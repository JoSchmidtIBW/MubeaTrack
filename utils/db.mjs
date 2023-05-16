import mariaDB from 'mariadb';
import dotenv from 'dotenv';
//import * as Process from "process";

console.log('bin Utils/db');

//nicht schön, aber so funktionierts wenn diese zwei sachen drin sind
dotenv.config({ path: './config.env' });
const resultDotenv = dotenv.config();

let db_Host = process.env.DB_HOST_db;
let db_User = process.env.DB_USER_db;
let db_Password = process.env.DB_PASSWORD_db;
let db_Database = process.env.DB_DATABASE_db;

// const poolDB = mariaDB.createPool({
//   host: db_Host, //'localhost',
//   user: db_User, //'root',
//   password: db_Password, //'Mubea2020!',//process.env.,//Process.env. env.DB_PASSWORD,//Process.env.DB_PASSWORD,//'Mubea2020!',
//   database: db_Database, //'mubeaVerkaufDataBase',
//   connectionLimit: 5,
// });

export default poolDB;
