const router = require('express').Router();
const { middlewareUserId, middlewareProfileUpdate, middlewareAvatarUpdate } = require('../middleware/regex');

const {
  getUsers, getCurrentUser, updateProfile, updateAvatar, getUserById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', middlewareUserId, getUserById);

router.patch('/me/avatar', middlewareAvatarUpdate, updateAvatar);
router.patch('/me', middlewareProfileUpdate, updateProfile);

module.exports = router;
