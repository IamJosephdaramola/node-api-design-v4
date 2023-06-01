import express, { NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { body } from 'express-validator';
import { handleInputErrors } from './modules/middleware';
import { router } from './router';
import { protect } from './modules/auth';
import { createNewUser, signIn } from './handlers/user';
import { ApiRequest, ApiResponse, ApiError } from './types';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
	setTimeout(() => {
		next(new Error('hello'));
	}, 1);
});

app.use('/api', protect, router);
app.post(
	'/user',
	body('username').exists().isString(),
	body('password').exists().isString(),
	handleInputErrors,
	createNewUser
);
app.post(
	'/signin',
	body('username').exists().isString(),
	body('password').exists().isString(),
	handleInputErrors,
	signIn
);

app.use(
	(
		err: ApiError,
		req: ApiRequest,
		res: ApiResponse,
		next: NextFunction
	): void => {
		if (err.type === 'auth') {
			res.status(401).json({ message: 'unauthorized' });
		} else if (err.type === 'input') {
			res.status(400).json({ message: 'invalid input' });
		}
		res.status(500).json({ message: 'Something went wrong' });
	}
);

export { app };
