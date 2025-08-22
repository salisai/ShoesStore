import Joi from "joi";

export const createOrderValidation = Joi.object({
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      size: Joi.string(),
      color: Joi.string(),
      quantity: Joi.number().min(1).required(),
    })
  ).min(1).required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required()
  }).required(),
  
  paymentMethod: Joi.string().valid("Stripe", "PayPal", "JazzCash", "EasyPaisa").required()
});
