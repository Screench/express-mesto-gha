const router = require('express').Router();
const {
  middlewareCreateCard, middlewareDeleteCardById, middlewareRemoveLike, middlewareSetLike,
} = require('../middleware/regex');

const {
  getCards, createCard, setLike, removeLike, deleteCardById,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', middlewareCreateCard, createCard);
router.delete('/:cardId/likes', middlewareRemoveLike, removeLike);
router.delete('/:cardId', middlewareDeleteCardById, deleteCardById);
router.put('/:cardId/likes', middlewareSetLike, setLike);

module.exports = router;
