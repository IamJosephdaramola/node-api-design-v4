import { prisma } from '../db';
import type { ApiRequest, ApiResponse } from '../types';

const getProducts = async (req: ApiRequest, res: ApiResponse) => {
	const user = await prisma.user.findUnique({
		where: { id: req?.user?.id },
		include: {
			products: true,
		},
	});

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	res.status(200).json({ data: user.products });
};

const getOneProduct = async (req: ApiRequest, res: ApiResponse) => {
	const product = await prisma.product.findFirst({
		where: {
			id: req.params.id,
			belongsToId: req?.user?.id,
		},
	});

	res.status(200).json({ data: product });
};

const createProduct = async (req: ApiRequest, res: ApiResponse) => {
	const product = await prisma.product.create({
		data: {
			name: req.body.name,
			belongsToId: req?.user?.id || '',
		},
	});

	res.status(201).json({ data: product });
};

const updateProduct = async (req: ApiRequest, res: ApiResponse) => {
	const updated = await prisma.product.update({
		where: {
			id_belongsToId: {
				id: req.params.id,
				belongsToId: req?.user?.id || '',
			},
		},
		data: {
			name: req.body.name,
		},
	});

	res.status(201).json({ data: updated });
};

const deleteProduct = async (req: ApiRequest, res: ApiResponse) => {
	const deleted = await prisma.product.delete({
		where: {
			id_belongsToId: {
				id: req.params.id,
				belongsToId: req?.user?.id || '',
			},
		},
	});

	res.status(200).json({ data: deleted });
};

export {
	createProduct,
	getOneProduct,
	getProducts,
	updateProduct,
	deleteProduct,
};
