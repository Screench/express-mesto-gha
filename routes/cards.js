const router = require('express').Router();

const { getCards, createCard, setLike, removeLike, deleteCardById } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId/likes', removeLike);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', setLike);

module.exports = router;