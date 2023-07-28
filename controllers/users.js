// //Контроллер пользователя
// const User = require('../models/user');


// const { INCORRECT_DATA_ERROR, DOCUMENT_NOT_FOUND_ERROR, UNKNOWN_ERROR } = require('../errors/errors');

// const getUsers = (req, res) => {
//   User.find({})

//     .then((users) => res.send(users))
//     .catch(err => {
//       return res.status(UNKNOWN_ERROR).send({
//         message: 'Неизвестная ошибка', err: err.message
//       });
//     });
// };

// const getUserById = (req, res) => {
//   User.findById(req.params.userId)
//     .orFail(() => new Error('No such user'))
//     .then(userData => res.send(userData))
//     .catch(err => {
//       if (err.name === 'CastError') {
//         res.status(INCORRECT_DATA_ERROR).send({
//           message: 'Переданы некорректные данные'
//         });
//       } else if (err.message === 'No such user') {
//         res.status(DOCUMENT_NOT_FOUND_ERROR).send({
//           message: 'Нет такого пользователя'
//         });
//       } else {
//         res.status(UNKNOWN_ERROR).send({
//           message: 'Неизвестная ошибка',
//           err: err.message
//         });
//       }
//     });
// };

// const createUser = (req, res) => {
//   const { name, about, avatar } = req.body;
//   User.create({ name, about, avatar })
//     .then((userData) => {
//       res.send(userData)
//     })
//     .catch(err => {
//       if (err.name === 'ValidationError') {
//         res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
//         return;
//       } else {
//         res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
//         return;
//       }
//     });
// };

// const updateProfile = (req, res) => {
//   const { name, about } = req.body;
//   const { _id } = req.user;
//   User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
//     .then((userData) => res.send(userData))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
//         return;
//       } else {
//         res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message })
//       }
//     })
// };


// const updateAvatar = (req, res) => {
//   const { avatar } = req.body;
//   const { _id } = req.user;
//   User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
//     .then((user) => res.send.json({avatar: user.avatar}))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         res.status(400).send({ message: `Переданные данные некорректны` });
//         return;
//       } else {
//         res.status(500).send({ message: `Произошла неизвестная ошибка`, err: err.message })
//       }
//     })
// };

// module.exports = {
//   createUser,
//   getUserById,
//   getUsers,
//   updateProfile,
//   updateAvatar,
// };


const User = require('../models/user')

const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(err => {
      return res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error("Not Found"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
        return;
      } if (err.message === "Not Found") {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь не найден` });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message });
      return;
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
        return;
      } else {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
  .then((user) => res.json({ name: user.avatar, about: user.about }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
        return;
      } else {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      }
    })
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.json({ avatar: user.avatar }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_VALIDATION).send({ message: `Переданные данные некорректны` });
        return;
      } else {
        res.status(ERROR_DEFAULT).send({ message: `Произошла неизвестная ошибка`, err: err.message })
      }
    })
}

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateProfile,
  updateAvatar,
};