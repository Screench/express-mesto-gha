//Контроллер пользователя
const User = require('../models/user');

const { INCORRECT_DATA_ERROR, DOCUMENT_NOT_FOUND_ERROR, UNKNOWN_ERROR } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})

    .then((users) => res.send(users))
    .catch(err => {
      return res.status(UNKNOWN_ERROR).send({
        message: 'Неизвестная ошибка', err: err.message
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
  .orFail(() => new Error('No such user'))
    .then(userData => res.send(userData))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR).send({
          message: 'Переданы некорректные данные'
        });
      } else if (err.message === 'No such user') {
        res.status(DOCUMENT_NOT_FOUND_ERROR).send({
          message: 'Нет такого пользователя'
        });
      } else {
        res.status(UNKNOWN_ERROR).send({
          message: 'Неизвестная ошибка',
          err: err.message
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((userData) => {
      res.send(userData)
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
        return;
      } else {
        res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
        return;
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then(userData => res.send(userData))
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(INCORRECT_DATA_ERROR).send({
          message: 'Переданы некорректные данные'
        });
      } else {
        res.status(UNKNOWN_ERROR).send({
          message: 'Неизвестная ошибка',
          err: err.message
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then(userData => res.send(userData))
    .catch((err) => {
      if (err.name === ValidationError) {
        res.status(INCORRECT_DATA_ERROR).send({
          message: 'Переданы некорректные данные'
        });
      } else {
        res.status(UNKNOWN_ERROR).send({
          message: 'Неизвестная ошибка',
          err: err.message
        });
      }
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateProfile,
  updateAvatar,
};