//import express from 'express';
import app from './app.mjs';

//const server = express();

// server.get('/', (req, res) => {
//   res.end('hello from server');
// });

const PORT = 7555;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
  console.log(`Server running on port: http://localhost:${PORT}...`);
  console.log(`Server running on port: http://127.0.0.1:${PORT}...`);
});

// let str = 'joij';
// let a = 44;
// let q = 'nini';
//
// let str = 'ninn';
//
// // ich "dd"
