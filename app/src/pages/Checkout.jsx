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

	// Payment Method State
	const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, card, upi
	const [cardNumber, setCardNumber] = useState('');
	const [cardExpiry, setCardExpiry] = useState('');
	const [cardCvv, setCardCvv] = useState('');
	const [upiId, setUpiId] = useState('');

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

		if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
			toast.warning('Please complete mock card details');
			return;
		}

		if (paymentMethod === 'upi' && !upiId) {
			toast.warning('Please enter mock UPI ID');
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

			const mockPaymentId =
				paymentMethod === 'cod'
					? 'COD-' + Math.floor(100000 + Math.random() * 900000)
					: 'MOCK-PAY-' + Math.random().toString(36).substring(2, 11).toUpperCase();

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
				paymentId: mockPaymentId,
			};

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const res = await axios.post(API_PATHS.ORDER.ADD, orderData, config);
			setCreatedOrder(res.data);
			dispatch(clearCart());
			setIsSuccess(true);
			toast.success('Order placed successfully!');
		} catch (error) {
			console.error(error);
			toast.error(
				error.response?.data?.message || 'Failed to place order. Please try again.'
			);
		} finally {
			setLoading(false);
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

					{/* Payment Options */}
					<Card className="border border-border/50 shadow-sm overflow-hidden">
						<CardHeader className="bg-muted/10 border-b py-4">
							<CardTitle className="text-lg font-bold flex items-center gap-2">
								<CreditCard className="h-5 w-5 text-primary" />
								Payment Method
							</CardTitle>
							<CardDescription>
								Choose how you would like to pay. Note: Payments are mocked.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6 pt-6">
							{/* Selectors */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
								<div
									onClick={() => setPaymentMethod('cod')}
									className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/20 select-none ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border/60 bg-card'}`}
								>
									<DollarSign
										className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground'}`}
									/>
									<span className="font-medium text-sm">Cash on Delivery</span>
									<span className="text-[10px] text-muted-foreground">
										Pay at your doorstep
									</span>
								</div>

								<div
									onClick={() => setPaymentMethod('card')}
									className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/20 select-none ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border/60 bg-card'}`}
								>
									<CreditCard
										className={`h-6 w-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`}
									/>
									<span className="font-medium text-sm">Credit / Debit Card</span>
									<span className="text-[10px] text-muted-foreground">
										Visa, Mastercard
									</span>
								</div>

								<div
									onClick={() => setPaymentMethod('upi')}
									className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/20 select-none ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border/60 bg-card'}`}
								>
									<Sparkles
										className={`h-6 w-6 ${paymentMethod === 'upi' ? 'text-primary' : 'text-muted-foreground'}`}
									/>
									<span className="font-medium text-sm">UPI Transfer</span>
									<span className="text-[10px] text-muted-foreground">
										Google Pay, PhonePe, Paytm
									</span>
								</div>
							</div>

							{/* Card Details Form Mock */}
							{paymentMethod === 'card' && (
								<div className="p-5 bg-muted/30 border rounded-xl space-y-4 animate-fade-in-up">
									<div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider">
										<span>Mock Card Details</span>
										<span className="text-emerald-600 font-medium">
											Fully Secure Mode
										</span>
									</div>
									<div className="space-y-2">
										<label className="text-xs font-medium text-muted-foreground">
											Card Number
										</label>
										<input
											type="text"
											placeholder="4111 2222 3333 4444"
											value={cardNumber}
											onChange={(e) => setCardNumber(e.target.value)}
											maxLength="19"
											className="h-9 w-full rounded-md border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label className="text-xs font-medium text-muted-foreground">
												Expiry Date
											</label>
											<input
												type="text"
												placeholder="MM/YY"
												value={cardExpiry}
												onChange={(e) => setCardExpiry(e.target.value)}
												maxLength="5"
												className="h-9 w-full rounded-md border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-xs font-medium text-muted-foreground">
												CVV
											</label>
											<input
												type="password"
												placeholder="•••"
												value={cardCvv}
												onChange={(e) => setCardCvv(e.target.value)}
												maxLength="4"
												className="h-9 w-full rounded-md border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
											/>
										</div>
									</div>
								</div>
							)}

							{/* UPI Details Form Mock */}
							{paymentMethod === 'upi' && (
								<div className="p-5 bg-muted/30 border rounded-xl space-y-4 animate-fade-in-up">
									<div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider">
										<span>Mock UPI details</span>
										<span className="text-emerald-600 font-medium">
											Instant Verification
										</span>
									</div>
									<div className="space-y-2">
										<label className="text-xs font-medium text-muted-foreground">
											UPI ID / VPA
										</label>
										<input
											type="text"
											placeholder="username@okaxis"
											value={upiId}
											onChange={(e) => setUpiId(e.target.value)}
											className="h-9 w-full rounded-md border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
										/>
									</div>
								</div>
							)}
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
