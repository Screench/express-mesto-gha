/* eslint-disable no-else-return */
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnknownError = require('../errors/UnknownError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Нет такого пользователя');
      } else {
        res.send(userData);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
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
        return next(new ValidationError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        return next(new ConflictError('Введенный email уже есть в системе'));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      } else {
        return next(new UnknownError('Неизвестная ошибка'));
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
        return next(new ValidationError('Переданы некорректные данные'));
      } else {
        return next(new UnknownError('Неизвестная ошибка'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new AuthError('Нет такого пользователя'))
    .then((userData) => {
      bcrypt.compare(password, userData.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: userData._id }, 'SECRET_KEY');
            res.cookie('jwt', jwt, {
              maxAge: 36000000,
              httpOnly: true,
              sameSite: true,
            });
            res.send(userData);
          } else {
            throw new AuthError('Неправильный пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет такого пользователя'))
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
