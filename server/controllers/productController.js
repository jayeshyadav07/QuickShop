import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

const getProducts = async (req, res) => {
	try {
		let limit = req.query.limit || 5;
		let skip = req.query.skip || 0;
		const products = await Product.find({}).limit(limit).skip(skip);
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createProduct = async (req, res) => {
	try {
		const { name, price, description, category, stock } = req.body;

		if (!name || !price || !description || !category || !stock) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ message: 'At least one image is required' });
		}

		// Upload Images to Cloudinary
		const uploads = await Promise.all(
			req.files.map((file) =>
				cloudinary.uploader.upload(file.path, {
					folder: 'products',
				})
			)
		);

		const images = uploads.map((upload) => upload.secure_url);

		const product = await Product.create({
			name,
			price,
			description,
			category,
			stock,
			imageUrl: images,
		});
		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({ message: error.message || 'Error in Product Creation' });
	}
};

const updateProduct = async (req, res) => {
	try {
		const { name, price, description, category, stock } = req.body;
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// update product fields if provided
		product.name = name || product.name;
		product.price = price || product.price;
		product.description = description || product.description;
		product.category = category || product.category;
		product.stock = stock || product.stock;

		let images = [];

		if (req.files && req.files.length > 0) {
			images = req.files.map((file) => file.path);

			// Upload Images to Cloudinary
			const uploads = await Promise.all(
				images.map((file) =>
					cloudinary.uploader.upload(file, {
						folder: 'products',
					})
				)
			);

			const newImages = uploads.map((upload) => upload.secure_url);

			// assign new images to product
			product.imageUrl = newImages;
		}

		const updatedProduct = await product.save();

		res.json(updatedProduct);
	} catch (error) {
		res.status(500).json({ message: error.message || 'Error in Product Update' });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			await product.deleteOne();
			res.json({ message: 'Product removed' });
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
