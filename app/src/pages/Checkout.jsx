import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { API_PATHS } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import {
	MapPin,
	CreditCard,
	ShoppingBag,
	CheckCircle2,
	Loader2,
	ArrowLeft,
	ShieldCheck,
	Truck,
	Sparkles,
	DollarSign,
} from 'lucide-react';

const Checkout = () => {
	const { user } = useContext(AuthContext);
	const { cartItems } = useSelector((state) => state.cart);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Redirect to login if user not authenticated
	useEffect(() => {
		if (!user) {
			toast.error('Please login to access checkout.');
			navigate('/login?redirect=/checkout');
		}
	}, [user, navigate]);

	// Shipping Address State
	const [fullName, setFullName] = useState(user?.name || '');
	const [street, setStreet] = useState('');
	const [city, setCity] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [country, setCountry] = useState('India');

	// Loading and Success State
	const [loading, setLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [createdOrder, setCreatedOrder] = useState(null);

	const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);

	const handleSubmitOrder = async (e) => {
		e.preventDefault();

		if (!fullName || !street || !city || !postalCode || !country) {
			toast.warning('Please fill in all shipping details');
			return;
		}

		try {
			setLoading(true);

			// Format items for database Schema
			const items = cartItems.map((item) => ({
				productId: item._id,
				qty: item.qty,
				price: item.price,
			}));

			const orderRes = await axios.post(
				API_PATHS.PAYMENT.CREATE_ORDER,
				{ amount: totalPrice },
				{
					headers: { Authorization: `Bearer ${user.token}` },
					validateStatus: () => true, // Never throw based on HTTP status
				}
			);

			if (orderRes.status != 200) {
				// Razorpay unconfigured exception handling
				const fallback = window.confirm(
					'Razorpay is currently unavailable. Use bypass mode to place order? (This is a demo app)'
				);

				if (fallback) {
					return bypassPayment();
				} else {
					toast.error('Razorpay is currently unavailable. Please try again later.');
					return;
				}
			}

			// Razorpay order created
			const razorpayOrder = orderRes.data;

			const razorpayOptions = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID,
				amount: razorpayOrder.amount,
				currency: razorpayOrder.currency,
				name: 'QuickShop',
				description: 'Order Payment',
				order_id: razorpayOrder.id,
				prefill: {
					name: user.name,
					email: user.email,
					address: fullName,
				},
				handler: async (response) => {
					const verifyRes = await axios.post(API_PATHS.PAYMENT.VERIFY_PAYMENT, response, {
						headers: {
							Authorization: `Bearer ${user.token}`,
							validateStatus: () => true,
						},
					});

					if (verifyRes.status == 200) {
						const orderData = {
							items,
							totalAmount: totalPrice,
							address: {
								fullName,
								street,
								city,
								postalCode,
								country,
							},
							paymentId: response.razorpay_payment_id,
						};

						const saveOrderRes = await axios.post(API_PATHS.ORDER.ADD, orderData, {
							headers: {
								Authorization: `Bearer ${user.token}`,
								validateStatus: () => true,
							},
						});

						if (saveOrderRes.status == 201) {
							setCreatedOrder(saveOrderRes.data);
							dispatch(clearCart());
							setIsSuccess(true);
							toast.success('Order placed successfully!');
						} else {
							toast.error('Order creation failed after payment verification');
							navigate('/cart');
							return;
						}
					} else {
						toast.error('Payment verification failed');
						navigate('/cart');
						return;
					}
				},
			};

			const rzp = new window.Razorpay(razorpayOptions);
			rzp.open();
		} catch (error) {
			console.error(error);
			toast.error(
				error.response?.data?.message || 'Failed to place order. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	const bypassPayment = async () => {
		// Format items for database Schema
		const items = cartItems.map((item) => ({
			productId: item._id,
			qty: item.qty,
			price: item.price,
		}));

		const orderData = {
			items,
			totalAmount: totalPrice,
			address: {
				fullName,
				street,
				city,
				postalCode,
				country,
			},
			paymentId: 'bypass_txn_' + Date.now(),
		};
		const saveOrderRes = await axios.post(API_PATHS.ORDER.ADD, orderData, {
			headers: { Authorization: `Bearer ${user.token}` },
		});

		if (saveOrderRes.status == 201) {
			setCreatedOrder(saveOrderRes.data);
			dispatch(clearCart());
			setIsSuccess(true);
			toast.success('Order placed successfully!');
		}
	};

	if (!user) {
		return (
			<div className="flex min-h-[80vh] items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground font-medium">
						Redirecting to login...
					</p>
				</div>
			</div>
		);
	}

	if (isSuccess && createdOrder) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16 min-h-[85vh] flex items-center justify-center">
				<Card className="w-full border border-border/60 shadow-xl overflow-hidden animate-fade-in-up bg-card/60 backdrop-blur-md">
					<div className="h-2 bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-600" />
					<CardContent className="pt-10 pb-8 px-6 sm:px-10 text-center flex flex-col items-center">
						<div className="relative mb-6">
							<div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
							<div className="relative bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-full border border-emerald-200 dark:border-emerald-800/50">
								<CheckCircle2 className="h-16 w-16 text-emerald-500 dark:text-emerald-400" />
							</div>
						</div>

						<h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
							Order Placed Successfully!
						</h1>
						<p className="text-muted-foreground text-sm max-w-md mb-8">
							Thank you for shopping with{' '}
							<span className="font-semibold text-primary">QuickShop</span>. Your
							order has been recorded and a confirmation email has been sent to{' '}
							<span className="font-medium text-foreground">{user.email}</span>.
						</p>

						<div className="w-full text-left bg-muted/30 border rounded-xl p-5 mb-8 space-y-3">
							<div className="flex justify-between items-center text-sm border-b pb-2">
								<span className="text-muted-foreground">Order ID</span>
								<span className="font-mono font-medium text-foreground">
									{createdOrder._id}
								</span>
							</div>
							<div className="flex justify-between items-center text-sm border-b pb-2">
								<span className="text-muted-foreground">Total Paid</span>
								<span className="font-bold text-foreground text-base">
									₹{createdOrder.totalAmount?.toLocaleString()}
								</span>
							</div>
							<div className="text-sm pt-1">
								<span className="text-muted-foreground block mb-1">
									Delivering To
								</span>
								<span className="font-medium text-foreground block">
									{createdOrder.address?.fullName}
								</span>
								<span className="text-muted-foreground text-xs block">
									{createdOrder.address?.street}, {createdOrder.address?.city},{' '}
									{createdOrder.address?.postalCode},{' '}
									{createdOrder.address?.country}
								</span>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 w-full">
							<Button asChild size="lg" className="flex-1 cursor-pointer">
								<Link to="/shop">
									<Sparkles className="mr-2 h-4 w-4" />
									Continue Shopping
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="flex-1 cursor-pointer"
							>
								<Link to="/">Go to Homepage</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (cartItems.length === 0) {
		return (
			<div className="mx-auto max-w-md px-4 py-16 min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
				<div className="text-6xl p-4 bg-muted/40 rounded-full">🛍️</div>
				<h1 className="text-2xl font-bold tracking-tight">Your Cart is Empty</h1>
				<p className="text-muted-foreground">Cannot checkout without items in your cart.</p>
				<Button asChild size="lg" className="mt-2 cursor-pointer">
					<Link to="/shop">Shop Products</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 min-h-[85vh] animate-fade-in-up">
			{/* Header */}
			<div className="flex items-center gap-3 mb-8">
				<Link
					to="/cart"
					className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-5 w-5" />
				</Link>
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
						Checkout
					</h1>
					<p className="text-sm text-muted-foreground">
						Verify items and provide delivery details.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmitOrder} className="grid gap-8 lg:grid-cols-[1fr_400px]">
				{/* Left Column: Forms */}
				<div className="space-y-6">
					{/* Shipping Address */}
					<Card className="border border-border/50 shadow-sm overflow-hidden">
						<CardHeader className="bg-muted/10 border-b py-4">
							<CardTitle className="text-lg font-bold flex items-center gap-2">
								<MapPin className="h-5 w-5 text-primary" />
								Shipping Address
							</CardTitle>
							<CardDescription>
								Enter the address where you want your products delivered.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 pt-6">
							<div className="space-y-2">
								<label
									htmlFor="fullName"
									className="text-sm font-medium leading-none"
								>
									Full Name
								</label>
								<input
									id="fullName"
									type="text"
									placeholder="John Doe"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									required
									className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="street"
									className="text-sm font-medium leading-none"
								>
									Street Address
								</label>
								<input
									id="street"
									type="text"
									placeholder="123 Main St, Apartment 4B"
									value={street}
									onChange={(e) => setStreet(e.target.value)}
									required
									className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2">
									<label
										htmlFor="city"
										className="text-sm font-medium leading-none"
									>
										City
									</label>
									<input
										id="city"
										type="text"
										placeholder="New Delhi"
										value={city}
										onChange={(e) => setCity(e.target.value)}
										required
										className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="postalCode"
										className="text-sm font-medium leading-none"
									>
										Postal / ZIP Code
									</label>
									<input
										id="postalCode"
										type="text"
										placeholder="110001"
										value={postalCode}
										onChange={(e) => setPostalCode(e.target.value)}
										required
										className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="country"
										className="text-sm font-medium leading-none"
									>
										Country
									</label>
									<input
										id="country"
										type="text"
										placeholder="India"
										value={country}
										onChange={(e) => setCountry(e.target.value)}
										required
										className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column: Order Summary & Action */}
				<div className="space-y-6">
					<Card className="border border-border/50 shadow-sm">
						<CardHeader className="py-4 border-b">
							<CardTitle className="text-lg font-bold flex items-center gap-2">
								<ShoppingBag className="h-5 w-5 text-primary" />
								Order Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="py-6 space-y-4">
							{/* Item Previews */}
							<div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
								{cartItems.map((item) => (
									<div
										key={item._id}
										className="flex gap-3 items-center text-sm border-b pb-3 last:border-0 last:pb-0"
									>
										<div className="h-12 w-12 rounded-lg border bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden">
											<img
												src={item.imageUrl}
												alt={item.name}
												className="max-h-full max-w-full object-contain p-0.5"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium line-clamp-1 text-foreground">
												{item.name}
											</p>
											<p className="text-xs text-muted-foreground">
												Qty: {item.qty} × ₹{item.price?.toLocaleString()}
											</p>
										</div>
										<p className="font-semibold shrink-0 text-foreground">
											₹{(item.price * item.qty).toLocaleString()}
										</p>
									</div>
								))}
							</div>

							{/* Totals */}
							<div className="border-t pt-4 space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Subtotal</span>
									<span className="text-foreground">
										₹{totalPrice.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Shipping</span>
									<span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
										<Truck className="h-3 w-3" /> Free
									</span>
								</div>
								<div className="border-t pt-3 flex justify-between font-bold text-base text-foreground">
									<span>Order Total</span>
									<span>₹{totalPrice.toLocaleString()}</span>
								</div>
							</div>

							{/* Safeguards */}
							<div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground flex gap-2 border">
								<ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
								<span>
									Secure SSL checkout. By placing this order, you agree to our
									policies. Mock order will be registered.
								</span>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								size="lg"
								className="w-full mt-2 cursor-pointer relative"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Placing Order...
									</>
								) : (
									'Place Order'
								)}
							</Button>
						</CardContent>
					</Card>
				</div>
			</form>
		</div>
	);
};

export default Checkout;
