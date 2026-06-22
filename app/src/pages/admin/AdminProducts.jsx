import AdminHeader from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AuthContext } from '@/context/AuthContext';
import { API_PATHS } from '@/utils/api';
import axios from 'axios';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const PRODUCTS_PER_PAGE = 8;

const AdminProducts = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [productsData, setProductsData] = useState({
		products: [],
		totalCount: 0,
		page: 1,
		totalPages: 1,
	});
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [deletingId, setDeletingId] = useState(null);

	useEffect(() => {
		if (!user || user.role !== 'admin') {
			navigate('/');
			return;
		}

		const fetchProducts = async () => {
			try {
				setLoading(true);
				const res = await axios.get(API_PATHS.PRODUCTS.GET, {
					params: {
						page,
						limit: PRODUCTS_PER_PAGE,
					},
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				setProductsData(res.data);
			} catch (error) {
				console.log(error);
				toast.error(error.response?.data?.message || 'Failed to fetch products');
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [user, navigate, page]);

	const handleDeleteProduct = async (productId) => {
		try {
			setDeletingId(productId);
			await axios.delete(API_PATHS.PRODUCTS.DELETE.replace(':id', productId), {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			const isLastItemOnPage = productsData.products.length === 1;

			setProductsData((current) => {
				const nextProducts = current.products.filter(
					(product) => product._id !== productId
				);
				return {
					...current,
					products: nextProducts,
					totalCount: Math.max(0, current.totalCount - 1),
				};
			});

			if (isLastItemOnPage && page > 1) {
				setPage((current) => current - 1);
			}

			toast.success('Product removed');
		} catch (error) {
			console.log(error);
			toast.error(error.response?.data?.message || 'Failed to delete product');
		} finally {
			setDeletingId(null);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-[80vh] items-center justify-center px-4">
				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" />
					Loading products...
				</div>
			</div>
		);
	}

	if (!productsData.products || productsData.products.length === 0) {
		return (
			<div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center px-4">
				<div className="text-center">
					<h1 className="text-2xl font-semibold tracking-tight">No products found</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Add products to start managing the catalog.
					</p>
					<Button className="mt-4" onClick={() => navigate('/admin/add-product')}>
						Add product
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[80vh] bg-background px-4 py-10 sm:px-6">
			<div className="mx-auto max-w-6xl">
				<AdminHeader />

				<div className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Admin Products</h1>
						<p className="mt-2 text-sm text-muted-foreground sm:text-base">
							Review the catalog and remove products when needed.
						</p>
						<p className="mt-3 text-sm font-semibold text-muted-foreground">
							{productsData.totalCount} total product
							{productsData.totalCount === 1 ? '' : 's'}
						</p>
					</div>
					<Button onClick={() => navigate('/admin/add-product')}>
						<Plus className="h-4 w-4" />
						Add product
					</Button>
				</div>

				<div className="grid gap-5">
					{productsData.products.map((product) => {
						const image = Array.isArray(product.imageUrl)
							? product.imageUrl[0]
							: product.imageUrl;
						const isDeleting = deletingId === product._id;

						return (
							<Card key={product._id}>
								<CardContent className="pt-6">
									<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
										<div className="flex flex-col gap-4 sm:flex-row">
											<div className="h-24 w-full overflow-hidden rounded-lg border bg-muted sm:w-24">
												{image ? (
													<img
														src={image}
														alt={product.name}
														className="h-full w-full object-cover"
													/>
												) : null}
											</div>

											<div className="space-y-3">
												<div>
													<h2 className="text-lg font-semibold">
														{product.name}
													</h2>
													<p className="mt-1 text-sm text-muted-foreground">
														{product.description}
													</p>
												</div>

												<div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
													<span className="rounded-full bg-muted px-3 py-1">
														Category: {product.category}
													</span>
													<span className="rounded-full bg-muted px-3 py-1">
														Stock: {product.stock}
													</span>
													<span className="rounded-full bg-muted px-3 py-1">
														Rs. {product.price}
													</span>
												</div>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<Button
												variant="outline"
												onClick={() => navigate(`/product/${product._id}`)}
											>
												View
											</Button>
											<Button
												variant="destructive"
												onClick={() => handleDeleteProduct(product._id)}
												disabled={isDeleting}
											>
												{isDeleting ? (
													<>
														<Loader2 className="h-4 w-4 animate-spin" />
														Removing...
													</>
												) : (
													<>
														<Trash2 className="h-4 w-4" />
														Delete
													</>
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
						Page {productsData.page} of {productsData.totalPages}
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
								setPage((current) => Math.min(productsData.totalPages, current + 1))
							}
							disabled={loading || page === productsData.totalPages}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminProducts;
