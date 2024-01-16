import { join } from 'path';
import bcrypt from 'bcryptjs';

import { db } from '../Db';

const filePath = join(__dirname, './users.json');

export const initializeAuthUser = async () => {
	try {
	  const email = process.env.EMAIL as string;
	  const password = process.env.PASSWORD as string;
	  const hashedPassword = await bcrypt.hash(password, 10);
  
	  db.run('INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
	} catch (error) {
	  throw error;
	}
  };