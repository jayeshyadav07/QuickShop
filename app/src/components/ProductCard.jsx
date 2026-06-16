import { Link } from 'react-router';

import { Card, CardContent } from '@/components/ui/card';

const ProductCard = ({ product }) => {
	return (
		<Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
			<Link to={`/product/${product._id}`}>
				<img
					src={product.imageUrl}
					alt={product.name}
					className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>

				<CardContent className="space-y-3 p-5">
					<h3 className="line-clamp-2 text-lg font-medium">{product.name}</h3>

					<div className="flex items-center justify-between">
						<span className="text-xl font-semibold">₹{product.price}</span>

						<span className="text-sm text-muted-foreground group-hover:text-primary">
							View →
						</span>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
};

export default ProductCard;
