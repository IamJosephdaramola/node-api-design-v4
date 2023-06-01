import type { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import type { ApiRequest, ApiResponse } from '../types';

const handleInputErrors = (
	req: ApiRequest,
	res: ApiResponse,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400);
		res.json({ errors: errors.array() });
	} else {
		next();
	}
};

export { handleInputErrors };
