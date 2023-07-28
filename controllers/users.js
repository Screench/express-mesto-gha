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
      if (err.name === 'ValidationError') {
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
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
        return;
      } else {
        res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message })
      }
    })
};


function updateAvatar(req, res) {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(userId, { avatar, }, {
    new: true, runValidators: true, upsert: false,
  },
  )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }

      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateProfile,
  updateAvatar,
};