import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { router } from './router';
import { protect } from './modules/auth';
import { createNewUser, signIn } from './handlers/user';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	next();
});

app.use('/api', protect, router);
app.post('/user', createNewUser);
app.post('/signin', signIn);

export { app };
