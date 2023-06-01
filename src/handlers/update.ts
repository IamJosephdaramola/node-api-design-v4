import { Update } from '@prisma/client';
import { prisma } from '../db';
import type { ApiRequest, ApiResponse } from '../types';

const getUpdates = async (req: ApiRequest, res: ApiResponse) => {
	const products = await prisma.product.findMany({
		where: { belongsToId: req?.user?.id },
		include: {
			updates: true,
		},
	});

	const updates = products.reduce<Update[]>((allUpdates, product) => {
		return [...allUpdates, ...product.updates];
	}, []);

	res.status(200).json({ data: updates });
};

const getOneUpdate = async (req: ApiRequest, res: ApiResponse) => {
	const update = await prisma.update.findUnique({
		where: { id: req.params.id },
	});

	if (!update) {
		return res.status(404).json({ message: 'update not found' });
	}

	res.status(200).json({ data: update });
};

const createUpdate = async (req: ApiRequest, res: ApiResponse) => {
	const product = await prisma.product.findUnique({
		where: {
			id_belongsToId: {
				id: req.body.productId,
				belongsToId: req?.user?.id || '',
			},
		},
	});

	if (!product) {
		return res
			.status(403)
			.json({ message: 'Product not associated with user' });
	}

	const update = await prisma.update.create({
		data: {
			body: req.body.body,
			title: req.body.title,
			product: { connect: { id: product.id } },
		},
	});

	res.status(201).json({ data: update });
};

const updateUpdate = async (req: ApiRequest, res: ApiResponse) => {
	const products = await prisma.product.findMany({
		where: {
			belongsToId: req?.user?.id || '',
		},
		include: { updates: true },
	});

	const updates = products.reduce<Update[]>((allUpdates, product) => {
		return [...allUpdates, ...product.updates];
	}, []);

	const match = updates.find((update) => update.id === req.params.id);

	if (!match) {
		return res
			.status(403)
			.json({ message: 'Update not associated with user' });
	}

	const updatedUpdate = await prisma.update.update({
		where: {
			id: match.id,
		},
		data: {
			title: req.body.title,
			body: req.body.body,
			status: req.body.status,
			version: req.body.version,
		},
	});

	res.status(201).json({ data: updatedUpdate });
};

const deleteUpdate = async (req: ApiRequest, res: ApiResponse) => {
	const products = await prisma.product.findMany({
		where: {
			belongsToId: req?.user?.id || '',
		},
		include: { updates: true },
	});

	const updates = products.reduce<Update[]>((allUpdates, product) => {
		return [...allUpdates, ...product.updates];
	}, []);

	const match = updates.find((update) => update.id === req.params.id);

	if (!match) {
		return res
			.status(403)
			.json({ message: 'Update not associated with user' });
	}

	const update = await prisma.update.delete({
		where: { id: req.params.id },
	});

	res.status(200).json({ data: update });
};

export { createUpdate, getOneUpdate, getUpdates, updateUpdate, deleteUpdate };
