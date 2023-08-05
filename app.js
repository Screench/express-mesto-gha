/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middleware/rateLimit');
const router = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

mongoose.connect(DB_URL);

app.use(router);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Прослушивание порта: ${PORT}`);
});
