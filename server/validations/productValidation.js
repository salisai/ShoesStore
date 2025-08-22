import Joi from "joi";

export const createProductValidation = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    sizes: Joi.array().items(Joi.string()),
    colors: Joi.array().items(Joi.string()),
    category: Joi.string().required(),
    description: Joi.string.allow("")
});
