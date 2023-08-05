const { celebrate, Joi } = require('celebrate');

const regExp = /^(http|https):\/\/(?:www\.)?[a-zA-Z0-9._~\-:?#[\]@!$&'()*+,/;=]{2,}\.[a-zA-Z0-9./?#-]{2,}$/;

const middlewareUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const middlewareProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const middlewareAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regExp).required(),
  }),
});

const middlewareDeleteCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const middlewareSetLike = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const middlewareRemoveLike = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const middlewareCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().pattern(regExp).optional(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const middlewareCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regExp).required(),
  }),
});

const middlewareLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  middlewareUserId,
  middlewareProfileUpdate,
  middlewareAvatarUpdate,
  middlewareDeleteCardById,
  middlewareSetLike,
  middlewareRemoveLike,
  middlewareCreateUser,
  middlewareCreateCard,
  middlewareLogin,
  regExp,
};
