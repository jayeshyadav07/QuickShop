import AdminHeader from '@/components/AdminHeader';
import { AuthContext } from '@/context/AuthContext';
import { API_PATHS } from '@/utils/api';
import axios from 'axios';
import { Boxes, ClipboardList, Loader2, Package, Plus, ShoppingCart, Users } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const fallbackAnalytics = {
	totalCompletedOrders: 0,
	totalOrders: 0,
	totalProducts: 0,
	totalRevenue: 0,
	totalUsers: 0,
};

const AdminDashboard = () => {
	const { user } = useContext(AuthContext);
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user || user.role !== 'admin') {
			navigate('/');
			return;
		}

		const fetchAnalytics = async () => {
			try {
				setLoading(true);
				const res = await axios.get(API_PATHS.ANALYTICS.GET, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});

				if (res.statusText === 'OK') {
					setAnalytics(res.data);
				} else {
					setAnalytics(fallbackAnalytics);
				}
			} catch (error) {
				console.log(error);
				toast.error(error.response?.data?.message || 'Failed to fetch data');
				setAnalytics(fallbackAnalytics);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, [user, navigate]);

	const stats = [
		{
			label: 'Total Orders',
			value: analytics?.totalOrders ?? fallbackAnalytics.totalOrders,
			icon: ShoppingCart,
		},
		{
			label: 'Completed Orders',
			value: analytics?.totalCompletedOrders ?? fallbackAnalytics.totalCompletedOrders,
			icon: ClipboardList,
		},
		{
			label: 'Total Products',
			value: analytics?.totalProducts ?? fallbackAnalytics.totalProducts,
			icon: Boxes,
		},
		{
			label: 'Total Users',
			value: analytics?.totalUsers ?? fallbackAnalytics.totalUsers,
			icon: Users,
		},
	];

	const actions = [
		{
			label: 'Add Product',
			description: 'Create a new item for the store',
			icon: Plus,
			onClick: () => navigate('/admin/add-product'),
		},
		{
			label: 'Manage Products',
			description: 'View, update, or remove products',
			icon: Package,
			onClick: () => navigate('/admin/products'),
		},
		{
			label: 'Manage Orders',
			description: 'Review order status and history',
			icon: ShoppingCart,
			onClick: () => navigate('/admin/orders'),
		},
		{
			label: 'Manage Users',
			description: 'See registered customer accounts',
			icon: Users,
			onClick: () => navigate('/admin/users'),
		},
	];

	return (
		<div className="min-h-[80vh] bg-background">
			<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
				<AdminHeader />

				<div className="border-b pb-6">
					<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight text-foreground">
								Admin Dashboard
							</h1>
							<p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
								Welcome back, {user?.name || 'Admin'}. Track store performance and
								manage products, orders, and users from one place.
							</p>
						</div>
						<div className="text-left md:text-right">
							<p className="text-sm text-muted-foreground">Revenue</p>
							<p className="mt-1 text-2xl font-semibold text-foreground">
								{`Rs. ${analytics?.totalRevenue ?? fallbackAnalytics.totalRevenue}`}
							</p>
						</div>
					</div>
				</div>

				<div className="grid gap-4 pt-8 sm:grid-cols-2 xl:grid-cols-4">
					{stats.map((stat) => {
						const Icon = stat.icon;
						return (
							<div key={stat.label} className="rounded-xl border bg-background p-5">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											{stat.label}
										</p>
										<p className="mt-2 text-2xl font-semibold tracking-tight">
											{stat.value}
										</p>
									</div>
									<div className="rounded-lg bg-muted p-2.5 text-muted-foreground">
										<Icon className="h-5 w-5" />
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="mt-10">
					<div className="mb-5 flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold">Quick actions</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Common admin routes with minimal friction.
							</p>
						</div>
						{loading ? (
							<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
						) : null}
					</div>

					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
						{actions.map((action) => {
							const Icon = action.icon;
							return (
								<button
									key={action.label}
									type="button"
									onClick={action.onClick}
									className="rounded-xl border p-4 text-left transition-colors hover:bg-muted/50"
								>
									<div className="flex items-start gap-3">
										<div className="rounded-lg bg-muted p-2.5 text-muted-foreground">
											<Icon className="h-5 w-5" />
										</div>
										<div className="flex-1">
											<h3 className="font-medium text-foreground">
												{action.label}
											</h3>
											<p className="mt-1 text-sm text-muted-foreground">
												{action.description}
											</p>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
