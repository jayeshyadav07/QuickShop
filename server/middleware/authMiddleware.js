import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
	if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		console.log(token, decoded);

		req.user = await User.findById(decoded.id).select('-password');

		console.log(req.user);

		next();
	} catch (error) {
		return res.status(403).json({ message: 'Not authorized, Token Expired' });
	}
};

const authorize = (roles) => (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}

	if (!roles.includes(req.user.role)) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	next();
};

export { authenticate, authorize };
