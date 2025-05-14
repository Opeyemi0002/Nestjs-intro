import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('test'),
  DB_PORT: Joi.number().port().default(5432),
  DB_PASSWORD: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_EXPIRY: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRY: Joi.string().required(),
  API_VERSION: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
});
