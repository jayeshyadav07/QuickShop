import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

// ─── Seed Data ────────────────────────────────────────────────────────────────

const users = [
	{
		name: 'Admin User',
		email: 'admin@quickshop.com',
		password: 'admin123',
		role: 'admin',
		verified: true,
	},
	{
		name: 'Jayesh Yadav',
		email: 'jayesh@example.com',
		password: 'jayesh123',
		role: 'user',
		verified: true,
	},
	{
		name: 'Priya Sharma',
		email: 'priya@example.com',
		password: 'priya123',
		role: 'user',
		verified: true,
	},
	{
		name: 'Rahul Verma',
		email: 'rahul@example.com',
		password: 'rahul123',
		role: 'user',
		verified: false,
	},
];

const products = [
	{
		name: 'Wireless Bluetooth Headphones',
		description:
			'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and Hi-Res audio support.',
		price: 2999,
		category: 'Electronics',
		stock: 50,
		imageUrl: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
		ratings: 4.5,
		numReviews: 120,
	},
	{
		name: 'Men Slim Fit Casual Shirt',
		description:
			'Cotton slim fit casual shirt with a modern cut, perfect for everyday wear. Available in multiple colors.',
		price: 799,
		category: 'Fashion',
		stock: 200,
		imageUrl: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
		ratings: 4.2,
		numReviews: 85,
	},
	{
		name: 'Stainless Steel Water Bottle',
		description:
			'Double-wall vacuum insulated water bottle, keeps drinks cold for 24 hours and hot for 12 hours. BPA-free, 750ml capacity.',
		price: 599,
		category: 'Home & Kitchen',
		stock: 300,
		imageUrl: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
		ratings: 4.7,
		numReviews: 210,
	},
	{
		name: 'Gaming Mechanical Keyboard',
		description:
			'RGB backlit mechanical keyboard with blue switches, anti-ghosting, and programmable macro keys. Built for gamers.',
		price: 3499,
		category: 'Electronics',
		stock: 75,
		imageUrl: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500'],
		ratings: 4.6,
		numReviews: 95,
	},
	{
		name: 'Running Shoes - UltraBoost',
		description:
			'Lightweight and responsive running shoes with Boost midsole cushioning and Primeknit upper for a snug, adaptive fit.',
		price: 4999,
		category: 'Footwear',
		stock: 120,
		imageUrl: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
		ratings: 4.8,
		numReviews: 340,
	},
	{
		name: 'Organic Green Tea (100 Bags)',
		description:
			'Premium organic green tea sourced from Darjeeling. Rich in antioxidants, refreshing taste with no artificial flavors.',
		price: 349,
		category: 'Grocery',
		stock: 500,
		imageUrl: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'],
		ratings: 4.3,
		numReviews: 160,
	},
	{
		name: 'Smartwatch Pro X',
		description:
			'Feature-packed smartwatch with AMOLED display, heart rate monitoring, SpO2 sensor, GPS, and 7-day battery life.',
		price: 6999,
		category: 'Electronics',
		stock: 40,
		imageUrl: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
		ratings: 4.4,
		numReviews: 75,
	},
	{
		name: 'Leather Laptop Backpack',
		description:
			'Genuine leather laptop backpack with padded compartment for up to 15.6" laptops. Anti-theft zipper and USB charging port.',
		price: 1999,
		category: 'Fashion',
		stock: 90,
		imageUrl: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
		ratings: 4.1,
		numReviews: 55,
	},
	{
		name: 'Non-Stick Cookware Set (5 Pcs)',
		description:
			'Premium non-stick cookware set including fry pan, saucepan, kadhai, tawa, and dosa tawa. Induction compatible.',
		price: 2499,
		category: 'Home & Kitchen',
		stock: 60,
		imageUrl: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'],
		ratings: 4.0,
		numReviews: 42,
	},
	{
		name: 'Yoga Mat - Premium 6mm',
		description:
			'Extra thick, non-slip yoga mat made from eco-friendly TPE material. Includes carry strap. Perfect for home workouts.',
		price: 899,
		category: 'Sports & Fitness',
		stock: 150,
		imageUrl: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
		ratings: 4.5,
		numReviews: 110,
	},
];

// ─── Seed Function ────────────────────────────────────────────────────────────

const seedDB = async () => {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGO_URI);
		console.log('✅ Connected to MongoDB');

		// Clear existing data
		await User.deleteMany({});
		await Product.deleteMany({});
		await Order.deleteMany({});
		console.log('🗑️  Cleared existing data');

		// Hash passwords and insert users
		const hashedUsers = await Promise.all(
			users.map(async (user) => {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(user.password, salt);
				return { ...user, password: hashedPassword };
			})
		);
		const createdUsers = await User.insertMany(hashedUsers);
		console.log(`👤 Inserted ${createdUsers.length} users`);

		// Insert products
		const createdProducts = await Product.insertMany(products);
		console.log(`📦 Inserted ${createdProducts.length} products`);

		// Create sample orders
		const orders = [
			{
				userId: createdUsers[1]._id, // Jayesh
				items: [
					{
						productId: createdProducts[0]._id,
						qty: 1,
						price: createdProducts[0].price,
					},
					{
						productId: createdProducts[4]._id,
						qty: 2,
						price: createdProducts[4].price,
					},
				],
				totalAmount: createdProducts[0].price + createdProducts[4].price * 2,
				address: {
					fullName: 'Jayesh Yadav',
					street: '42, MG Road, Andheri West',
					city: 'Mumbai',
					postalCode: '400058',
					country: 'India',
				},
				paymentId: 'pay_sample_001',
				paymentStatus: 'Completed',
				status: 'Delivered',
			},
			{
				userId: createdUsers[2]._id, // Priya
				items: [
					{
						productId: createdProducts[6]._id,
						qty: 1,
						price: createdProducts[6].price,
					},
					{
						productId: createdProducts[7]._id,
						qty: 1,
						price: createdProducts[7].price,
					},
				],
				totalAmount: createdProducts[6].price + createdProducts[7].price,
				address: {
					fullName: 'Priya Sharma',
					street: '15, Sector 22, Dwarka',
					city: 'New Delhi',
					postalCode: '110077',
					country: 'India',
				},
				paymentId: 'pay_sample_002',
				paymentStatus: 'Completed',
				status: 'Shipped',
			},
			{
				userId: createdUsers[1]._id, // Jayesh (2nd order)
				items: [
					{
						productId: createdProducts[2]._id,
						qty: 3,
						price: createdProducts[2].price,
					},
					{
						productId: createdProducts[5]._id,
						qty: 2,
						price: createdProducts[5].price,
					},
					{
						productId: createdProducts[9]._id,
						qty: 1,
						price: createdProducts[9].price,
					},
				],
				totalAmount:
					createdProducts[2].price * 3 +
					createdProducts[5].price * 2 +
					createdProducts[9].price,
				address: {
					fullName: 'Jayesh Yadav',
					street: '42, MG Road, Andheri West',
					city: 'Mumbai',
					postalCode: '400058',
					country: 'India',
				},
				paymentStatus: 'Pending',
				status: 'Pending',
			},
		];

		const createdOrders = await Order.insertMany(orders);
		console.log(`🛒 Inserted ${createdOrders.length} orders`);

		console.log('\n🌱 Database seeded successfully!\n');

		// Print summary
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log('         SEED SUMMARY');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log(`  Users    : ${createdUsers.length}`);
		console.log(`  Products : ${createdProducts.length}`);
		console.log(`  Orders   : ${createdOrders.length}`);
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log('\n📧 Test Credentials:');
		console.log('  Admin  → admin@quickshop.com / admin123');
		console.log('  User   → jayesh@example.com / jayesh123');
		console.log('  User   → priya@example.com / priya123');
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

		process.exit(0);
	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	}
};

seedDB();
