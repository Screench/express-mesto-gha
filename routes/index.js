const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middleware/auth');
const NotFoundError = require('../errors/NotFoundError');
const { middlewareCreateUser, middlewareLogin } = require('../middleware/regex');

router.post('/signup', middlewareCreateUser, createUser);
router.post('/signin', middlewareLogin, login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Нет такой страницы'));
});

module.exports = router;
