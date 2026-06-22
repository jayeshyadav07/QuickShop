import AdminHeader from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/context/AuthContext';
import { API_PATHS } from '@/utils/api';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered'];

const inputClassName =
	'h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const getStatusClassName = (status) => {
	switch (status) {
		case 'Delivered':
			return 'bg-green-100 text-green-800';
		case 'Shipped':
			return 'bg-blue-100 text-blue-800';
		default:
			return 'bg-yellow-100 text-yellow-800';
	}
};

const AdminOrders = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [ordersData, setOrdersData] = useState({
		orders: [],
		totalCount: 0,
		page: 1,
		totalPages: 1,
	});
	const [selectedStatuses, setSelectedStatuses] = useState({});
	const [loading, setLoading] = useState(true);
	const [savingOrderId, setSavingOrderId] = useState(null);

	useEffect(() => {
		if (!user || user.role !== 'admin') {
			navigate('/');
			return;
		}

		const fetchOrders = async () => {
			try {
				setLoading(true);
				const res = await axios.get(API_PATHS.ORDER.GET, {
					params: {
						page,
						limit: 5,
					},
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});

				setOrdersData(res.data);
				setSelectedStatuses(
					Object.fromEntries(
						(res.data.orders || []).map((order) => [order._id, order.status])
					)
				);
			} catch (error) {
				console.log(error);
				toast.error(error.response?.data?.message || 'Failed to fetch orders');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [user, navigate, page]);

	const handleStatusChange = (orderId, status) => {
		setSelectedStatuses((current) => ({
			...current,
			[orderId]: status,
		}));
	};

	const handleUpdateStatus = async (orderId) => {
		const status = selectedStatuses[orderId];

		try {
			setSavingOrderId(orderId);
			const res = await axios.put(
				API_PATHS.ORDER.UPDATE_STATUS.replace(':id', orderId),
				{ status },
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);

			setOrdersData((current) => ({
				...current,
				orders: current.orders.map((order) =>
					order._id === orderId ? { ...order, status: res.data.status } : order
				),
			}));
			toast.success('Order status updated');
		} catch (error) {
			console.log(error);
			toast.error(error.response?.data?.message || 'Failed to update order status');
		} finally {
			setSavingOrderId(null);
		}
	};

	const formatDate = (dateString) =>
		new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});

	if (loading) {
		return (
			<div className="flex min-h-[80vh] items-center justify-center px-4">
				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" />
					Loading orders...
				</div>
			</div>
		);
	}

	if (!ordersData.orders || ordersData.orders.length === 0) {
		return (
			<div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center px-4">
				<div className="text-center">
					<h1 className="text-2xl font-semibold tracking-tight">No orders found</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Orders will appear here once customers start purchasing.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[80vh] bg-background px-4 py-10 sm:px-6">
			<div className="mx-auto max-w-6xl">
				<AdminHeader />

				<div className="mb-8 border-b pb-6">
					<h1 className="text-3xl font-bold tracking-tight">Admin Orders</h1>
					<p className="mt-2 text-sm text-muted-foreground sm:text-base">
						Review recent orders and update their fulfillment status.
					</p>
					<p className="mt-3 text-sm text-muted-foreground font-semibold">
						{ordersData.totalCount} total order{ordersData.totalCount === 1 ? '' : 's'}
					</p>
				</div>

				<div className="space-y-5">
					{ordersData.orders.map((order) => {
						const currentStatus = selectedStatuses[order._id] || order.status;
						const isSaving = savingOrderId === order._id;
						const isUnchanged = currentStatus === order.status;

						return (
							<Card key={order._id}>
								<CardHeader className="border-b">
									<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
										<div>
											<CardTitle className="text-lg">
												Order #{order._id.slice(-8).toUpperCase()}
											</CardTitle>
											<CardDescription className="mt-2">
												Placed on {formatDate(order.createdAt)}
											</CardDescription>
										</div>

										<div className="flex flex-wrap items-center gap-3">
											<span
												className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClassName(order.status)}`}
											>
												{order.status}
											</span>
											<span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
												Payment: {order.paymentStatus}
											</span>
										</div>
									</div>
								</CardHeader>

								<CardContent className="space-y-6 pt-6">
									<div className="grid gap-6 md:grid-cols-3">
										<div className="space-y-1">
											<p className="text-sm text-muted-foreground">
												Customer
											</p>
											<p className="font-medium">
												{order.address?.fullName || 'Customer'}
											</p>
										</div>
										<div className="space-y-1 md:col-span-2">
											<p className="text-sm text-muted-foreground">
												Shipping address
											</p>
											<p className="font-medium">
												{[
													order.address?.street,
													order.address?.city,
													order.address?.postalCode,
													order.address?.country,
												]
													.filter(Boolean)
													.join(', ')}
											</p>
										</div>
									</div>

									<div className="rounded-xl border">
										<div className="border-b px-4 py-3">
											<p className="font-medium">Items</p>
										</div>
										<div className="divide-y">
											{order.items?.map((item, index) => (
												<div
													key={`${order._id}-${index}`}
													className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
												>
													<div>
														<p className="font-medium">
															{item.productId?.name || 'Product'}
														</p>
														<p className="text-sm text-muted-foreground">
															Qty: {item.qty} x Rs. {item.price}
														</p>
													</div>
													<p className="font-medium">
														Rs. {item.price * item.qty}
													</p>
												</div>
											))}
										</div>
									</div>

									<div className="flex flex-col gap-4 border-t pt-5 md:flex-row md:items-end md:justify-between">
										<div>
											<p className="text-sm text-muted-foreground">
												Total amount
											</p>
											<p className="mt-1 text-xl font-semibold">
												Rs. {order.totalAmount}
											</p>
										</div>

										<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
											<select
												value={currentStatus}
												onChange={(e) =>
													handleStatusChange(order._id, e.target.value)
												}
												className={inputClassName}
												disabled={isSaving}
											>
												{ORDER_STATUSES.map((status) => (
													<option key={status} value={status}>
														{status}
													</option>
												))}
											</select>
											<Button
												onClick={() => handleUpdateStatus(order._id)}
												disabled={isSaving || isUnchanged}
											>
												{isSaving ? (
													<>
														<Loader2 className="h-4 w-4 animate-spin" />
														Updating...
													</>
												) : (
													'Update status'
												)}
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				<div className="mt-8 flex items-center justify-between border-t pt-6">
					<p className="text-sm text-muted-foreground">
						Showing page {ordersData.page} of {ordersData.totalPages}
					</p>
					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							onClick={() => setPage((current) => Math.max(1, current - 1))}
							disabled={loading || page === 1}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								setPage((current) => Math.min(ordersData.totalPages, current + 1))
							}
							disabled={loading || page === ordersData.totalPages}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminOrders;
