const express = require('express');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost.localdomain/mestodb';
const { PORT = 3000 } = process.env;
const { DOCUMENT_NOT_FOUND_ERROR } = require('./errors/errors');
const router = require('./routes/index');
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
app.use('/', (req, res) => {
  res.status(DOCUMENT_NOT_FOUND_ERROR).send({
    message: 'Не найдено'
  });
});

app.listen(PORT, () => {
  console.log(`Прослушивание порта ${PORT}`);
});