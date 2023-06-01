import type { Request, Response } from 'express';
import type { User } from '@prisma/client';

interface ApiRequest extends Request {
	user?: { id: User['id']; username: User['username'] };
}

interface ApiError extends Error {
	type: 'auth' | 'input';
}

interface ApiResponse extends Response {}

export type { ApiRequest, ApiResponse, ApiError };
