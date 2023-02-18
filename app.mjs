import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('hello from server from app.mjs');
});

export default app;
