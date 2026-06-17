import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
	const { cartItems } = useSelector((state) => state.cart);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);

	if (cartItems.length === 0) {
		return (
			<div className="mx-auto max-w-4xl px-4 min-h-[80vh] flex flex-col items-center justify-center gap-4">
				<div className="text-6xl">🛒</div>
				<h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
				<p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
				<Link to="/shop">
					<Button size="lg">Continue Shopping</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 min-h-[80vh]">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-semibold tracking-tight">
					Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
				</h1>
				<Button
					variant="outline"
					size="sm"
					className="text-destructive hover:bg-destructive/10"
					onClick={() => {
						dispatch(clearCart());
						toast.success('Cart cleared');
					}}
				>
					Clear Cart
				</Button>
			</div>

			<div className="grid gap-8 lg:grid-cols-[1fr_320px]">
				{/* Cart Items */}
				<div className="flex flex-col gap-4">
					{cartItems.map((item) => (
						<Card key={item._id} className="flex-row items-center p-0">
							<CardContent className="flex items-center gap-4 w-full py-4">
								{/* Image */}
								<Link to={`/product/${item._id}`} className="shrink-0">
									<div className="h-20 w-20 overflow-hidden rounded-lg border bg-muted/30 flex items-center justify-center">
										<img
											src={item.imageUrl}
											alt={item.name}
											className="max-h-full max-w-full object-contain p-1"
										/>
									</div>
								</Link>

								{/* Info */}
								<div className="flex-1 min-w-0">
									<Link
										to={`/product/${item._id}`}
										className="font-medium hover:underline line-clamp-1"
									>
										{item.name}
									</Link>
									<p className="text-sm text-muted-foreground mt-1">
										Qty: {item.qty}
									</p>
								</div>

								{/* Price */}
								<div className="text-right shrink-0">
									<p className="font-medium">
										₹{(item.price * item.qty).toLocaleString()}
									</p>
									{item.qty > 1 && (
										<p className="text-xs text-muted-foreground">
											₹{item.price.toLocaleString()} each
										</p>
									)}
								</div>

								{/* Remove */}
								<Button
									variant="ghost"
									size="icon"
									className="shrink-0 text-muted-foreground hover:text-destructive"
									onClick={() => {
										dispatch(removeFromCart(item._id));
										toast.success(`${item.name} removed from cart`);
									}}
									title="Remove item"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
										<line x1="10" x2="10" y1="11" y2="17" />
										<line x1="14" x2="14" y1="11" y2="17" />
									</svg>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Summary */}
				<div className="lg:sticky lg:top-24 h-fit">
					<Card>
						<CardContent className="flex flex-col gap-4 py-6">
							<h2 className="font-semibold text-lg">Order Summary</h2>

							<div className="flex flex-col gap-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Subtotal</span>
									<span>₹{totalPrice.toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Shipping</span>
									<span className="text-green-600">Free</span>
								</div>
							</div>

							<div className="border-t pt-3 flex justify-between font-semibold text-base">
								<span>Total</span>
								<span>₹{totalPrice.toLocaleString()}</span>
							</div>

							<Button
								size="lg"
								className="w-full mt-2 cursor-pointer"
								onClick={() => {
									if (user) {
										navigate('/checkout');
									} else {
										toast.warning('Please log in to proceed to checkout.');
										navigate('/login?redirect=/checkout');
									}
								}}
							>
								Proceed to Checkout
							</Button>

							<Link
								to="/shop"
								className="text-center text-sm text-muted-foreground hover:underline"
							>
								Continue Shopping
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Cart;
