import dotenv from 'dotenv';
dotenv.config({ path: './config.env' }); //muss nur hier definiert werden    und oben stehen hier!!//

import app from './app.mjs';

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

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
  console.log(`Server running on port: http://localhost:${PORT}...`);
  console.log(`Server running on port: http://127.0.0.1:${PORT}...`);
});

//vercel test
export default app; // "type": "module",
