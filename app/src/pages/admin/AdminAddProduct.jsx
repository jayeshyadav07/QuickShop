import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/context/AuthContext';
import { API_PATHS } from '@/utils/api';
import axios from 'axios';
import { Loader2, Upload } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const initialProduct = {
	name: '',
	description: '',
	price: '',
	category: '',
	stock: '',
	images: [],
};

const inputClassName =
	'h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const AdminAddProduct = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [product, setProduct] = useState(initialProduct);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!user || user.role !== 'admin') {
			navigate('/');
		}
	}, [user, navigate]);

	const handleChange = (e) => {
		const { name, value, files, type } = e.target;

		if (type === 'file') {
			const selectedFiles = Array.from(files || []).slice(0, 5);
			setProduct((current) => ({ ...current, [name]: selectedFiles }));
			return;
		}

		setProduct((current) => ({ ...current, [name]: value }));
	};

	const handleAddProduct = async (e) => {
		e.preventDefault();

		if (
			!product.name ||
			!product.description ||
			!product.price ||
			!product.category ||
			!product.stock ||
			product.images.length === 0
		) {
			toast.warning('Please fill in all fields and upload at least one image.');
			return;
		}

		const formData = new FormData();
		formData.append('name', product.name.trim());
		formData.append('description', product.description.trim());
		formData.append('price', product.price);
		formData.append('category', product.category.trim());
		formData.append('stock', product.stock);

		product.images.forEach((file) => {
			formData.append('images', file);
		});

		try {
			setLoading(true);
			await axios.post(API_PATHS.PRODUCTS.CREATE, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${user.token}`,
				},
			});

			toast.success('Product added successfully');
			setProduct(initialProduct);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response?.data?.message || 'Failed to add product');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[80vh] bg-background px-4 py-10 sm:px-6">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8">
					<h1 className="mt-4 text-3xl text-center font-bold tracking-tight">
						Add Product
					</h1>
				</div>

				<div className="mx-auto max-w-3xl">
					<Card>
						<CardHeader>
							<CardTitle>Product details</CardTitle>
							<CardDescription>
								Fill in the core information for the new product.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleAddProduct} className="space-y-5">
								<div className="grid gap-5 sm:grid-cols-2">
									<div className="space-y-2 sm:col-span-2">
										<label
											htmlFor="name"
											className="text-sm font-medium leading-none"
										>
											Product name
										</label>
										<input
											id="name"
											type="text"
											name="name"
											placeholder="Wireless headphones"
											value={product.name}
											onChange={handleChange}
											className={inputClassName}
										/>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="price"
											className="text-sm font-medium leading-none"
										>
											Price
										</label>
										<input
											id="price"
											type="number"
											name="price"
											min="0"
											step="0.01"
											placeholder="1999"
											value={product.price}
											onChange={handleChange}
											className={inputClassName}
										/>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="stock"
											className="text-sm font-medium leading-none"
										>
											Stock
										</label>
										<input
											id="stock"
											type="number"
											name="stock"
											min="0"
											step="1"
											placeholder="24"
											value={product.stock}
											onChange={handleChange}
											className={inputClassName}
										/>
									</div>

									<div className="space-y-2 sm:col-span-2">
										<label
											htmlFor="category"
											className="text-sm font-medium leading-none"
										>
											Category
										</label>
										<input
											id="category"
											type="text"
											name="category"
											placeholder="Electronics"
											value={product.category}
											onChange={handleChange}
											className={inputClassName}
										/>
									</div>

									<div className="space-y-2 sm:col-span-2">
										<label
											htmlFor="description"
											className="text-sm font-medium leading-none"
										>
											Description
										</label>
										<textarea
											id="description"
											name="description"
											rows="6"
											placeholder="Write a short product description..."
											value={product.description}
											onChange={handleChange}
											className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="images"
										className="text-sm font-medium leading-none"
									>
										Product images
									</label>
									<label
										htmlFor="images"
										className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition-colors hover:bg-muted/40"
									>
										<Upload className="h-6 w-6 text-muted-foreground" />
										<p className="mt-3 text-sm font-medium">
											Upload up to 5 images
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											PNG, JPG, WEBP or other standard image formats
										</p>
									</label>
									<input
										id="images"
										ref={fileInputRef}
										type="file"
										name="images"
										accept="image/*"
										multiple
										onChange={handleChange}
										className="hidden"
									/>
									<p className="text-xs text-muted-foreground">
										{product.images.length > 0
											? `${product.images.length} image${product.images.length > 1 ? 's' : ''} selected`
											: 'No images selected yet'}
									</p>
								</div>

								<div className="flex flex-wrap gap-3">
									<Button type="submit" disabled={loading}>
										{loading ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												Adding product...
											</>
										) : (
											'Add product'
										)}
									</Button>
									<Button
										type="button"
										variant="outline"
										disabled={loading}
										onClick={() => {
											setProduct(initialProduct);
											if (fileInputRef.current) {
												fileInputRef.current.value = '';
											}
										}}
									>
										Reset
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AdminAddProduct;
