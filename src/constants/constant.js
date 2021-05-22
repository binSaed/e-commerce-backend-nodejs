module.exports = Object.freeze({
  USER_ENUM: {
    USER: "user",
    MODERATOR: "moderator",
    ADMIN: "admin",
    OWNER: "owner",
  },
  USER_TYPE: ["user", "moderator", "admin", "owner"],
  PERMISSIONS: {
    addCategory: ["moderator", "admin", "owner"],
    addItem: ["moderator", "admin", "owner"],
  },
  PHONE_LOCAL: ["ar-EG", "ar-SA"],
  LANGUAGES: ["en", "ar"],
  DEFAULT_LANGUAGE: "en",
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 25,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 25,
  RANDOM_CODE_LENGTH: 6,
  MAX_IMAGES_IN_ITEM: 4,
});
