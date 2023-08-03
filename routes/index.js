const router = require('express').Router();
const auth = require('../middleware/auth');

const { DOCUMENT_NOT_FOUND_ERROR } = require('../errors/errors');

const cardRoutes = require('./cards');
const userRoutes = require('./users');

router.use(auth);

router.use('/cards', cardRoutes);
router.use('/users', userRoutes);

router.use('/', (reg, res) => {
  res.status(DOCUMENT_NOT_FOUND_ERROR).send({
    message: 'Не найдено',
  });
});

module.exports = router;
