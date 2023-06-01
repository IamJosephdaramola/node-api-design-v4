import type { Request, Response } from 'express';
import type { User } from '@prisma/client';

interface ApiRequest extends Request {
	user?: { id: User['id']; username: User['username'] };
}

interface ApiResponse extends Response {}

export type { ApiRequest, ApiResponse };
