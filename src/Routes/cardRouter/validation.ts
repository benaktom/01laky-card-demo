import Joi from 'joi';

export const cardNumberSchema = Joi.string().creditCard().required();
