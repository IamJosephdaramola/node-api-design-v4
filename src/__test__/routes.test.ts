import supertest from 'supertest';
import { app } from '../server';

describe('GET /', () => {
	it('should sent back error text', async () => {
		const res = await supertest(app).get('/');

		expect(res.body.message).toBe('Something went wrong');
	});
});
