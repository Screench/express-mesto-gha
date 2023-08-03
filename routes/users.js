const router = require('express').Router();

const {
  getUsers, getCurrentUser, updateProfile, updateAvatar, getUserById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', getUserById);

router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateProfile);

module.exports = router;
