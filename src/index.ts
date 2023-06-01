import * as dotenv from 'dotenv';
dotenv.config();

import { app } from './server';

// process.on('uncaughtException', () => {});

// process.on('unhandledRejection', () => {});

app.listen(3001, () => {
	console.log('server listening on 3001');
});
