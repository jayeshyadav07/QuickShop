import Order from '../models/Order.js';
import { orderConfirmationTemplate } from '../templates/order-confirmation-email.js';
import sendEmail from '../utils/sendEmail.js';

const createOrder = async (req, res) => {
	const { items, totalAmount, address, paymentId } = req.body;
	if (!items || !totalAmount || !address) {
		return res.status(400).json({ message: 'All fields are required' });
	}
	try {
		const order = new Order({
			userId: req.user._id,
			items,
			totalAmount,
			address,
			paymentId,
			paymentStatus: 'Completed',
		});
		const createdOrder = await order.save();

		// Send Order Confirmation Email
		const message = orderConfirmationTemplate(
			req.user.name,
			createdOrder._id,
			createdOrder.totalAmount,
			createdOrder.address
		);

		await sendEmail({
			to: req.user.email,
			subject: 'QuickShop - Order Confirmation',
			message,
		});

		res.status(201).json(createdOrder);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ userId: req.user._id })
			.sort({ createdAt: -1 })
			.populate('items.productId', 'name price');
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getOrders = async (req, res) => {
	try {
		const orders = await Order.find({}).populate('userId', 'id name');
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateOrderStatus = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}
		order.status = req.body.status;
		await order.save();
		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export { createOrder, getMyOrders, getOrders, updateOrderStatus };
