const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const router = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(helmet());
app.use(express.json());

// Авторизация
app.use((req, res, next) => {
  req.userId = {
    _id: '64bebcd29d7618328a28fa38',
  };
  next();
});

mongoose.connect(DB_URL);
app.use(router);

app.listen(PORT, () => {
  console.log(`Прослушивание порта: ${PORT}`);
});
