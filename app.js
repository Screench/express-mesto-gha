const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes');
const errorsHandler = require('./middleware/errorHandler');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(DB_URL);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().optional(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(router);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Прослушивание порта: ${PORT}`);
});
