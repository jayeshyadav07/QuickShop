import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { API_PATHS } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { addToCart } from '../redux/cartSlice';
import { toast } from 'sonner';

const ProductDetails = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [product, setProduct] = useState({});
	const [qty, setQty] = useState(0);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchSingleProduct = async () => {
			try {
				setLoading(true);
				const API_URL = API_PATHS.PRODUCTS.GET_BY_ID.replace(':id', id);
				const res = await axios.get(API_URL);
				console.log(res.data);
				setProduct(res.data);
			} catch (error) {
				console.error('failed to get product details', error);
				toast.error('Failed to load product details');
			} finally {
				setLoading(false);
			}
		};

		fetchSingleProduct();
	}, []);

	const handleAddToCart = () => {
		if (qty === 0) {
			toast.warning('Please select a quantity');
			return;
		}
		dispatch(addToCart({ ...product, qty }));
		toast.success(`${product.name} added to cart`);
		setQty(0);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl px-4 py-10 min-h-[80vh] flex items-center">
			<div className="grid gap-10 md:grid-cols-2 items-start w-full">
				{/* Image */}
				<div className="overflow-hidden rounded-xl border bg-muted/30 h-[400px] flex items-center justify-center">
					<img
						src={product.imageUrl}
						alt={product.name}
						className="max-h-full max-w-full object-contain p-6"
					/>
				</div>

				{/* Info */}
				<div className="flex flex-col gap-5">
					<h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>

					{product.price != null && (
						<p className="text-xl font-medium">₹{product.price}</p>
					)}

					{product.description && (
						<p className="text-muted-foreground leading-relaxed">
							{product.description}
						</p>
					)}

					{/* Quantity */}
					<div className="flex items-center gap-3 pt-2">
						<span className="text-sm text-muted-foreground">Qty</span>
						<div className="flex items-center rounded-lg border">
							<Button
								variant="ghost"
								size="icon"
								className="h-9 w-9 rounded-r-none"
								disabled={qty === 0}
								onClick={() => setQty((p) => p - 1)}
							>
								−
							</Button>
							<span className="w-10 text-center text-sm font-medium">{qty}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-9 w-9 rounded-l-none"
								onClick={() => setQty((p) => p + 1)}
							>
								+
							</Button>
						</div>
					</div>

					{/* Add to cart */}
					<Button
						className="mt-2 w-full md:w-auto"
						size="lg"
						disabled={qty === 0}
						onClick={handleAddToCart}
					>
						Add to Cart
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
