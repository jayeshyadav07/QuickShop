const BASE_URL = 'http://localhost:3000/api';

export const API_PATHS = {
	PRODUCTS: {
		GET: `${BASE_URL}/products`,
		GET_BY_ID: `${BASE_URL}/products/:id`,
		CREATE: `${BASE_URL}/products`,
		UPDATE: `${BASE_URL}/products/:id`,
		DELETE: `${BASE_URL}/products/:id`,
	},
	AUTH: {
		LOGIN: `${BASE_URL}/auth/login`,
		REGISTER: `${BASE_URL}/auth/register`,
		USERS: `${BASE_URL}/auth/users`,
	},
	ORDER: {
		GET: `${BASE_URL}/orders`,
		MY_ORDERS: `${BASE_URL}/orders/my-orders`,
		ADD: `${BASE_URL}/orders`,
		UPDATE_STATUS: `${BASE_URL}/orders/:id/status`,
	},
	PAYMENT: {
		CREATE_ORDER: `${BASE_URL}/payment/order`,
		VERIFY_PAYMENT: `${BASE_URL}/payment/verify`,
	},
	ANALYTICS: {
		GET: `${BASE_URL}/analytics`,
	},
};
