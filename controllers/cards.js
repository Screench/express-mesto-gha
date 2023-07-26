// Контроллер карточки
const Card = require('../models/card');

const { INCORRECT_DATA_ERROR, DOCUMENT_NOT_FOUND_ERROR, UNKNOWN_ERROR } = require('../errors/errors');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', error: err.message });
  }
};

const createCard = async (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  if (!name || !link) {
    res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
    return;
  }

  try {
    const card = await Card.create({ name, link, owner: _id });
    res.send(card);
  } catch (err) {
    res.status(UNKNOWN_ERROR).send({
      message: 'Неизвестная ошибка',
      error: err.message,
    });
  }
};

const setLike = async (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true }
    );
    if (!card) {
      res.status(DOCUMENT_NOT_FOUND_ERROR).send({
        message: 'Не найдено'
      });
      return;
    }
    res.send(card);
  } catch (err) {
    res.status(UNKNOWN_ERROR).send({ message: 'Неизвестная ошибка', error: err.message });
  }
};

const removeLike = async (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
      { new: true }
    );
    if (!card) {
      res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Не найдено' });
      return;
    }
    res.send(card);
  } catch (err) {
    res.status(UNKNOWN_ERROR).send({
      message: 'Неизвестная ошибка', error: err.message
    });
  }
};

const deleteCardById = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Не найдено' });
      return;
    }
    res.send({ message: 'Карточка успешно удалена' });
  } catch (err) {
    res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
  }
};

module.exports = {
  getCards,
  createCard,
  setLike,
  removeLike,
  deleteCardById,
};