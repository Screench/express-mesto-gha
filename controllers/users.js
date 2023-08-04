const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const ErrorAuth = require('../errors/errorAuth');
const ErrorConflict = require('../errors/errorConflict');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorValidation = require('../errors/errorValidation');
const UnknownError = require('../errors/errorUnknown');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Нет такого пользователя'))
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.message === 'Нет такого пользователя') {
        res.status(DOCUMENT_NOT_FOUND_ERROR).send({
          message: 'Нет такого пользователя',
        });
      } else {
        res.status(UNKNOWN_ERROR).send({
          message: 'Неизвестная ошибка', err: err.message,
        });
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({ name, about, avatar, email, password: hashedPassword }))
    .then((userData) => res.send(userData.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ErrorConflict('Введенный email уже есть в системе'));
      }
      next(err);
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.userId;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.userId;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (!req.body.avatar) {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new ErrorAuth('Нет такого пользователя'))
    .then((userData) => {
      bcrypt.compare(password, userData.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: userData._id }, 'SECRET');
            res.cookie('jwt', jwt, {
              maxAge: 360000000,
              httpOnly: true,
              sameSite: true,
            });
            res.send(userData);
          } else {
            throw new ErrorAuth('Неправильный пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.userData._id)
  .orFail(new ErrorNotFound('Нет такого пользователя'))
  .then((userData) => res.send(userData))
  .catch((err) => next(err));
}


module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
