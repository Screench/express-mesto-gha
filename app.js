const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { DOCUMENT_NOT_FOUND_ERROR } = require('./errors/errors');
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';
const { PORT = 3000 } = process.env
const app = express();
app.use(express.json());

// Авторизация
app.use((req, res, next) => {
  req.userId = {_id: '64bebcd29d7618328a28fa38'};
  next();
});

mongoose.connect(DB_URL);
app.use(router);
app.use('/', (reg, res) => {
  res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Не найдено'});
});

app.listen(PORT, () => {
  console.log(`Прослушивание порта: ${PORT}`)
});