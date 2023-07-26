const router = require('express').Router();

const { getUsers, createUser, updateProfile, updateAvatar, getUserById } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);
router.get('/:userId', getUserById);




module.exports = router;