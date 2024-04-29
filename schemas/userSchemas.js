import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string(),
  avatarUrl: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const verifEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid address",
    "any.required": "Missing required email field",
  }),
});

export const schemas = {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  verifEmailSchema,
};
