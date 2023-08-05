const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const ErrorAuth = require('../errors/errorAuth');
const ErrorConflict = require('../errors/errorConflict');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorValidation = require('../errors/errorValidation');
const UnknownError = require('../errors/errorUnknown');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (!userData) {
        throw new ErrorNotFound('Нет такого пользователя');
      } else {
        next(res.send(userData));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданы некорректные данные'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then((userData) => res.status(201).send(userData.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ErrorConflict('Введенный email уже есть в системе'));
      }
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные'));
      } else {
        next(new UnknownError('Неизвестная ошибка'));
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданые некорректные данные'));
      } else {
        next(new UnknownError('Неизвестная ошибка'));
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
              maxAge: 36000000,
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
  User.findById(req.user._id)
    .orFail(new ErrorNotFound('Нет такого пользователя'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
