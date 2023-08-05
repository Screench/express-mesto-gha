const router = require('express').Router();
const {
  validateCreateCard, validateDeleteCardById, validateRemoveLike, validateSetLike,
} = require('../middleware/regex');

const {
  getCards, createCard, setLike, removeLike, deleteCardById,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId/likes', validateRemoveLike, removeLike);
router.delete('/:cardId', validateDeleteCardById, deleteCardById);
router.put('/:cardId/likes', validateSetLike, setLike);

module.exports = router;
