import morgan from 'morgan';
import express from 'express';

const app = express();

// Middleware

// Development logging
console.log('wiso undefinded??? process.env.NODE_ENV: ' + process.env.NODE_ENV); // wiso ist dieser undefinded? bei server.mjs ist morgan zuoberst und erst dann app
if (process.env.NODE_ENV === 'development') {
  // wenn undefined oder development... :)
  app.use(morgan('dev')); // wenn nicht geht, hat man kein logger!
}

app.use(express.json()); //für post (daten von client zu bekommen), muss json sein

// my middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware :)');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.status(200).send('hello from server from app.mjs');
});

export default app;
