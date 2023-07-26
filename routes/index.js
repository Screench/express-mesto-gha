const router = require('express').Router();

const cardsRoutes = require('./cards');
const usersRoutes = require('./users');

router.use('/cards', cardsRoutes);
router.use('/users', usersRoutes);


module.exports = router;