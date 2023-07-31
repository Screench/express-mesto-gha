const router = require('express').Router();

const {
  getUsers, createUser, updateProfile, updateAvatar, getUserById,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);

router.get('/:userId', getUserById);

router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateProfile);

module.exports = router;
