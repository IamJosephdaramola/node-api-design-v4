import { NextFunction } from 'express';
import { prisma } from '../db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import type { ApiRequest, ApiResponse, ApiError } from '../types';

const createNewUser = async (
	req: ApiRequest,
	res: ApiResponse,
	next: NextFunction
) => {
	const { username, password } = req.body;

	const hash = await hashPassword(password);

	try {
		const user = await prisma.user.create({
			data: {
				username,
				password: hash,
			},
		});
		const token = createJWT(user);

		res.status(201).json({ token });
	} catch (error) {
		const authError = error as ApiError;

		authError.type = 'input';

		next(authError);
	}
};

const signIn = async (req: ApiRequest, res: ApiResponse) => {
	const { username, password } = req.body;

	const user = await prisma.user.findUnique({
		where: { username },
	});

	if (!user) {
		return res
			.status(401)
			.json({ message: 'Invalid username or password' });
	}

	const isValid = await comparePasswords(password, user.password);

	if (!isValid) {
		return res
			.status(401)
			.json({ message: 'Invalid username or password' });
	}

	const token = createJWT(user);

	res.status(201).json({ token });
};

export { createNewUser, signIn };
