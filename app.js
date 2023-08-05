/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(DB_URL);

app.use(router);

app.use(errors());
app.use(errorHandler);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Прослушивание порта: ${PORT}`);
});
