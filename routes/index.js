const router = require('express').Router();
const cardRoutes = require('./cards');
const userRoutes = require('./users');
const { createUser, login } = require('../controllers/users');
const auth = require('../middleware/auth');
const { validateCreateUser, validateLogin } = require('../middleware/regex');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/cards', cardRoutes);
router.use('/users', userRoutes);

module.exports = router;
