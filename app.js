const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { DOCUMENT_NOT_FOUND_ERROR } = require('./errors/errors');

const { PORT = 3000 } = process.env

const app = express();
app.use(express.json());


/**временное решение авторизации */

app.use((req, res, next) => {
  req.user = {
    _id: '648b5b06e0e871c705f93215' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(router);
app.use('/', (reg, res) => {
  res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Что-то пошло не так...'});
});

app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`)
});