//Контроллер карточки
const Card = require('../models/card');

const { INCORRECT_DATA_ERROR, DOCUMENT_NOT_FOUND_ERROR, UNKNOWN_ERROR } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})

  .then((cards) => res.send(cards))
  .catch(err => {
    res.status(UNKNOWN_ERROR).send({
      message: 'Неизвестная ошибка', err: err.message
    });
  })
};

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id})
  .then((cardData) => res.send(cardData))
  .catch(err => {
    if (!name || !link || err) {
      res.status(INCORRECT_DATA_ERROR).send({
        message: 'Переданы некорректные данные'
      });
      return;
    } else {
      res.status(UNKNOWN_ERROR).send({
        message: 'Неизвестная ошибка', err: err.message
       });
    }
  });
}

const setLike = (req, res) => {
  const { _id } = req.user;
  const {cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id}}, { new: true})
  .then(cardData => {
    if (!cardData) {
      res.status(DOCUMENT_NOT_FOUND_ERROR).send({
        message: 'Не найдено'
      });
      return;
    }
    res.send(cardData)
  })
  .catch(err => {
    if (!Card[cardId]) {
      res.status(INCORRECT_DATA_ERROR).send({
        message: 'Переданы некорректные данные'
      });
      return;
    } else {
      res.status(UNKNOWN_ERROR).send({
        message: 'Неизвестная ошибка', err: err.message
      });
    }
  })
};

const removeLike = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, {$pull: { likes: _id}}, {new: true})
  .then(cardData => {
    if (!cardData) {
      res.status(DOCUMENT_NOT_FOUND_ERROR).send({
        message: 'Не найдено'
      });
      return;
    }
    res.send(cardData)
  })
  .catch(err => {
    if (!Card[_id]) {
      res.status(INCORRECT_DATA_ERROR).send({
        message: 'Переданы некорректные данные'
      });
      return;
    } else {
      res.status(UNKNOWN_ERROR).send({
        message: 'Неизвестная ошибка'
      });
    }
  })
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
  .then((cardData) => {
    if (!cardData) {
      res.status(DOCUMENT_NOT_FOUND_ERROR).send({
        message: 'Не найдено'
      });
      return;
    }
    res.send({
      message: 'Карточка успешно удалена'
    })
  })
  .catch(() => {
    if (!Card[cardId]) {
      res.status(INCORRECT_DATA_ERROR).send({
        message: 'Переданы некорректные данные'
      });
    }
  })
};

module.exports = {
getCards,
createCard,
setLike,
removeLike,
deleteCardById
};