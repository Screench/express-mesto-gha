const express = require('express');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost.localdomain:27017/mestodb';
const { PORT = 3000 } = process.env
const { DOCUMENT_NOT_FOUND_ERROR } = require('./errors/errors');
const router = require('./routes');
const app = express();
app.use(express.json());

// Авторизация
app.use((req, res, next) => {
  req.user = {
    _id: '64bebcd29d7618328a28fa38'
  };
  next();
});

mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
app.use(router);
app.use('/', (reg, res) => {
  res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Пока тут ничего нет' });
});

app.listen(PORT, () => {
  console.log(`Прослушивание порта ${PORT}`)
});