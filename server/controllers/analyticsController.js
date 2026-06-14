import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const getAnalytics = async (req, res) => {
	try {
		// Count total users
		const totalUsers = await User.countDocuments();

		// Count total products
		const totalProducts = await Product.countDocuments();

		// Count total orders
		const totalOrders = await Order.countDocuments();

		// All Orders with completed status
		const completedOrders = await Order.find({ status: 'Completed' });
		const totalCompletedOrders = completedOrders.length;

		// Total revenue from completed orders
		const totalRevenue = completedOrders.reduce((total, order) => total + order.totalAmount, 0);

		// Return response
		res.status(200).json({
			totalUsers,
			totalProducts,
			totalOrders,
			totalCompletedOrders,
			totalRevenue,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export { getAnalytics };
