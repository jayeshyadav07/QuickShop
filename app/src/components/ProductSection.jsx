import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { API_PATHS } from '@/utils/api';
import ProductCard from '@/components/ProductCard';

const ProductSection = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const res = await axios.get(`${API_PATHS.PRODUCTS.GET}?limit=4`);
				setProducts(res.data.products);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	return (
		<section className="py-16">
			<div className="mb-10 flex items-center justify-between">
				<h2 className="text-3xl font-bold">Featured Products</h2>

				<Button asChild variant="outline">
					<Link to="/shop">View All</Link>
				</Button>
			</div>

			{loading ? (
				<div className="flex justify-center py-16">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
				</div>
			) : products.length === 0 ? (
				<p className="py-16 text-center text-muted-foreground">No products found.</p>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{products.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			)}
		</section>
	);
};

export default ProductSection;
