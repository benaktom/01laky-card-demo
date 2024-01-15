import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs/promises';
import { join } from 'path';

import {
  validateLogin,
} from './validators';

const authRouter = Router();

const filePath = join(__dirname, '../../Services/DemoUser/users.json');

authRouter.post('/login', async (request: Request, response: Response) => {
  const requestUser = { ...request.body };

  try {
    const { error } = validateLogin(requestUser);

    if (error) {
      return response.status(400).send('Some error');
    }

    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    const user = users.find((u: { email: string, password: string }) => u.email === requestUser.email);

    if (!user) {
      return response.status(400).send('Email not found');
    }

    const validPassword = await bcrypt.compare(requestUser.password, user.password);

    if (!validPassword) {
      return response.status(400).send('Invalid password');
    }
    const token = jsonwebtoken.sign({
      email: user.email,
    }, process.env.TOKEN_SECRET as string);

    return response.status(200).send({ token });
  } catch (error) {
    return response.status(500).send('something wrong');
  }
});

export default authRouter;
