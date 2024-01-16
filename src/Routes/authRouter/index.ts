import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { db } from '../../Services/Db';
import { join } from 'path';

import { validateLogin } from './validators';

import { IUser } from './interfaces';

const authRouter = Router();

db.serialize(() => {
	db.run(`
	  CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE,
		password TEXT
	  )
	`);
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       description: User credentials for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: example_password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             example:
 *               token: "your-access-token"
 *       400:
 *         description: Bad request
 *         content:
 *           text/plain:
 *             example: "Some error"
 *       401:
 *         description: Unauthorized
 *         content:
 *           text/plain:
 *             example:
 *               - "Email not found"
 *               - "Invalid password"
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             example: "Something went wrong"
 */
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
				return response.status(401).send('Email not found');
			}

			const validPassword = await bcrypt.compare(requestUser.password, user.password);
			if (!validPassword) {
				return response.status(401).send('Invalid password');
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
