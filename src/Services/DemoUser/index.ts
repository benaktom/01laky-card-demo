import fs from 'fs/promises';
import { join } from 'path';
import bcrypt from 'bcryptjs';

import { IUser } from './interfaces';

const filePath = join(__dirname, './users.json');

export const initializeAuthUser = async () => {
	try {
		let users: IUser[] = [];
		try {
			await fs.access(filePath);
			const data = await fs.readFile(filePath, 'utf-8');
			users = JSON.parse(data);
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
				await fs.writeFile(filePath, '[]', 'utf-8');
			} else {
				throw err;
			}
		}
		const email = process.env.EMAIL as string;
		const password = process.env.PASSWORD as string;
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = users.find(usr => usr.email === email);
		if (!user) {
			const newUser = {
				email,
				password: hashedPassword,
			};
			users.push(newUser);

			await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');
		}
	} catch (error) {
		throw error;
	}
};
