const router = require('express').Router();

const { getCards, createCard, setLike, removeLike, deleteCardById } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.put('/:cardId/likes', setLike);
router.delete('/:cardId/likes', removeLike);
router.delete('/:cardId', deleteCardById);


module.exports = router;