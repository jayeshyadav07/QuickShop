import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API_PATHS } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const Order = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}

		const fetchOrders = async () => {
			try {
				setLoading(true);
				const response = await axios.get(API_PATHS.ORDER.MY_ORDERS, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				setOrders(response.data.orders);
			} catch (error) {
				console.error('Failed to fetch orders:', error);
				toast.error('Failed to load orders');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [user, navigate]);

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'shipped':
				return 'bg-blue-100 text-blue-800';
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getPaymentStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<div className="mx-auto max-w-5xl px-4 min-h-[80vh] flex flex-col items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				<p className="mt-4 text-muted-foreground">Loading your orders...</p>
			</div>
		);
	}

	if (!orders || orders.length === 0) {
		return (
			<div className="mx-auto max-w-5xl px-4 min-h-[80vh] flex flex-col items-center justify-center gap-4">
				<div className="text-6xl">📦</div>
				<h1 className="text-2xl font-semibold tracking-tight">No orders yet</h1>
				<p className="text-muted-foreground">You haven't placed any orders yet.</p>
				<a href="/shop" className="mt-4 inline-block">
					<button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
						Start Shopping
					</button>
				</a>
			</div>
		);
	}

	return (
		<main className="mx-auto max-w-5xl px-4 py-10 min-h-[80vh]">
			{/* Page Header */}
			<div className="mb-10">
				<h1 className="text-4xl font-bold tracking-tight">Your Orders</h1>
				<p className="mt-2 text-muted-foreground">
					View and track all your orders from QuickShop
				</p>
			</div>

			{/* Orders List */}
			<div className="space-y-6">
				{orders.map((order) => (
					<Card key={order._id} className="overflow-hidden">
						{/* Order Header */}
						<CardHeader className="bg-muted/50 border-b">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<div className="flex items-center gap-3">
										<CardTitle className="text-lg">
											Order #{order._id.slice(-8).toUpperCase()}
										</CardTitle>
										<span
											className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
										>
											{order.status}
										</span>
									</div>
									<p className="text-sm text-muted-foreground mt-2">
										Ordered on {formatDate(order.createdAt)}
									</p>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold">
										₹{order.totalAmount.toLocaleString()}
									</p>
									<span
										className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getPaymentStatusColor(order.paymentStatus)}`}
									>
										Payment: {order.paymentStatus}
									</span>
								</div>
							</div>
						</CardHeader>

						{/* Order Items */}
						<CardContent className="pt-6">
							<div className="mb-6">
								<h3 className="font-semibold mb-4">Order Items</h3>
								<div className="space-y-3">
									{order.items &&
										order.items.map((item, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
											>
												<div className="flex-1">
													<p className="font-medium">
														{item.productId?.name || 'Product'}
													</p>
													<p className="text-sm text-muted-foreground">
														Qty: {item.qty} × ₹
														{item.price.toLocaleString()}
													</p>
												</div>
												<p className="font-semibold">
													₹{(item.price * item.qty).toLocaleString()}
												</p>
											</div>
										))}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
};

export default Order;
