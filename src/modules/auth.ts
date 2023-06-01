import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import type { ApiRequest, ApiResponse } from '../types';

interface Owner {
	id: User['id'];
	username: User['username'];
	iat: number;
}

const comparePasswords = (password: string, hash: string) => {
	return bcrypt.compare(password, hash);
};

const hashPassword = (password: string) => {
	return bcrypt.hash(password, 10);
};

const createJWT = (user: User) => {
	const token = jwt.sign(
		{ id: user.id, username: user.username },
		process.env.JWT_SECRET as string
	);

	return token;
};

const protect = (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
	const bearer = req.headers.authorization;

	if (!bearer) {
		return res.status(401).json({ message: 'Not authorized' });
	}

	const [, token] = bearer.split(' '); // returns "Bearer and the token"

	if (!token) {
		return res.status(401).json({ message: 'Not authorized' });
	}

	try {
		const user = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as Owner;

		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({ message: 'Not authorized' });
	}
};

export { createJWT, protect, comparePasswords, hashPassword };
