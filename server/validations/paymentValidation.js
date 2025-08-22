import Joi from "joi";

export const createPaymentValidation = Joi.object({
  order: Joi.string().required(),
  amount: Joi.number().min(1).required(),
  provider: Joi.string().valid("Stripe", "PayPal", "JazzCash", "EasyPaisa").required(),
});
