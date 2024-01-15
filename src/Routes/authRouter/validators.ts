import Joi from 'joi';

import { IRequestUser } from './interfaces';

export const validateLogin = (data: IRequestUser) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
};
