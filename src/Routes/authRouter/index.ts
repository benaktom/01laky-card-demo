import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
// import fs from 'fs/promises';
import { db } from '../../Services/Db';
import { join } from 'path';

import { validateLogin } from './validators';

import { IUser } from './interfaces';

const authRouter = Router();

const filePath = join(__dirname, '../../Services/DemoUser/users.json');

db.serialize(() => {
	db.run(`
	  CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE,
		password TEXT
	  )
	`);
  });

authRouter.post('/login', async (request: Request, response: Response) => {
	const requestUser: IUser = { ...request.body };
	try {
		const { error } = validateLogin(requestUser);
		if (error) {
		  return response.status(400).send('Some error');
		}
	
		db.get('SELECT * FROM users WHERE email = ?', [requestUser.email], async (err, user: IUser) => {
		  if (err) {
			return response.status(500).send('Something went wrong');
		  }
	
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
		});
	  } catch (error) {
		return response.status(500).send('Something went wrong');
	  }
});

export default authRouter;
