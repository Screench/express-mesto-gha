const router = require('express').Router();
const { validateUserId, validateProfileUpdate, validateAvatarUpdate } = require('../utils/regex');

const {
  getUsers, getCurrentUser, updateProfile, updateAvatar, getUserById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me/avatar', validateAvatarUpdate, updateAvatar);
router.patch('/me', validateProfileUpdate, updateProfile);

module.exports = router;
