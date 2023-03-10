import morgan from 'morgan';
import express from 'express';
import poolDB from './utils/db.mjs';

import path from 'path'; //__dirname is not definet
import { fileURLToPath } from 'url'; //__dirname is not definet

const app = express();

// Middleware

// Development logging
console.log('wiso undefinded??? process.env.NODE_ENV: ' + process.env.NODE_ENV); // wiso ist dieser undefinded? bei server.mjs ist morgan zuoberst und erst dann app
if (process.env.NODE_ENV === 'development') {
  // wenn undefined oder development... :)
  app.use(morgan('dev')); // wenn nicht geht, hat man kein logger!
}

app.use(express.json()); //für post (daten von client zu bekommen), muss json sein

const __filename = fileURLToPath(import.meta.url); //__dirname is not definet
const __dirname = path.dirname(__filename); //__dirname is not definet

//um auf html css zuzugreifen, was jedoch eine API nicht macht
app.use(express.static(`${__dirname}/public`));

// my middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware :)');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.status(200).send('hello from server from app.mjs');
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

export default app;
