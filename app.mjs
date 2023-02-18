import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.end('hello from server from app.mjs');
});

export default app;
