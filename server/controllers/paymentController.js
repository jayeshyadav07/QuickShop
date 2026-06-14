import razorpay from 'razorpay';
import crypto from 'crypto';

const createOrder = async (req, res) => {
	try {
		const razorpayInstance = new razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const amount = Number(req.body.amount);
		const order = razorpayInstance.orders.create({
			amount: amount * 100, // razorpay takes amount in paisa
			currency: 'INR',
			receipt: crypto.randomBytes(10).toString('hex'),
		});

		if (!order) {
			return res.status(500).json({ success: false, message: 'Order creation failed' });
		}

		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const verifyPayment = () => {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
	if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
		return res.status(400).json({ message: 'Invalid payment details' });
	}

	try {
		const secret = process.env.KEY_SECRET;
		const verifier = crypto
			.createHmac('sha256', secret)
			.update(`${razorpay_order_id}|${razorpay_payment_id}`)
			.digest('hex');

		if (razorpay_signature === verifier) {
			return res.status(200).json({ message: 'Payment verified successfully' });
		} else {
			return res.status(400).json({ message: 'Invalid signature sent!' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export { createOrder, verifyPayment };
