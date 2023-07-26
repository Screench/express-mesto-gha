// Контроллер пользователя
const User = require('../models/user');
const { INCORRECT_DATA_ERROR, DOCUMENT_NOT_FOUND_ERROR, UNKNOWN_ERROR } = require('../errors/errors');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(new Error("Not Found"));
    res.send(user);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
    } else if (err.message === "Not Found") {
      res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Нет такого пользователя' });
    } else {
      res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
    }
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !avatar) {
    res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
    return;
  }

  try {
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    res.status(INCORRECT_DATA_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
  }
};

const updateProfileUser = async (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true }
    );
    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
    }
  }
};


const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  try {
    const user = await User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true });
    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', err: err.message });
    }
  }
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateProfile,
  updateAvatar,
};