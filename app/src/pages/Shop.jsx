import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_PATHS } from '@/utils/api';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

const PRODUCTS_PER_PAGE = 8;

const Shop = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [categories, setCategories] = useState([]);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
			setCurrentPage(1);
		}, 400);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Fetch all categories on mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await axios.get(`${API_PATHS.PRODUCTS.GET}?limit=100`);
				const cats = [...new Set(res.data.products.map((p) => p.category))];
				setCategories(cats.sort());
			} catch (error) {
				console.error('Failed to fetch categories:', error);
			}
		};
		fetchCategories();
	}, []);

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({
				page: currentPage,
				limit: PRODUCTS_PER_PAGE,
			});

			if (debouncedSearch) params.append('search', debouncedSearch);
			if (selectedCategory) params.append('category', selectedCategory);

			const res = await axios.get(`${API_PATHS.PRODUCTS.GET}?${params.toString()}`);
			setProducts(res.data.products);
			setTotalPages(res.data.totalPages);
			setTotalCount(res.data.totalCount);
		} catch (error) {
			console.error('Failed to fetch products:', error);
		} finally {
			setLoading(false);
		}
	}, [currentPage, debouncedSearch, selectedCategory]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const handleCategoryChange = (category) => {
		setSelectedCategory(category === selectedCategory ? '' : category);
		setCurrentPage(1);
	};

	// Generate pagination range with ellipsis
	const getPaginationRange = () => {
		const range = [];
		const delta = 2;
		const left = Math.max(2, currentPage - delta);
		const right = Math.min(totalPages - 1, currentPage + delta);

		range.push(1);

		if (left > 2) {
			range.push('...');
		}

		for (let i = left; i <= right; i++) {
			range.push(i);
		}

		if (right < totalPages - 1) {
			range.push('...');
		}

		if (totalPages > 1) {
			range.push(totalPages);
		}

		return range;
	};

	return (
		<main className="container mx-auto min-h-[80vh] px-6 py-8">
			{/* Page Header */}
			<div className="mb-10">
				<h1 className="text-4xl font-bold tracking-tight">Shop</h1>
				<p className="mt-2 text-muted-foreground">
					Discover our curated collection of premium products
				</p>
			</div>

			{/* Search & Filters Bar */}
			<div className="mb-8 space-y-5">
				{/* Search Input */}
				<div className="relative">
					<svg
						className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
					<input
						id="product-search"
						type="text"
						placeholder="Search products..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery('')}
							className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="h-4 w-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>

				{/* Category Filters */}
				{categories.length > 0 && (
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => handleCategoryChange('')}
							className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
								selectedCategory === ''
									? 'border-primary bg-primary text-primary-foreground shadow-md'
									: 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
							}`}
						>
							All
						</button>
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => handleCategoryChange(cat)}
								className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
									selectedCategory === cat
										? 'border-primary bg-primary text-primary-foreground shadow-md'
										: 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Results Info */}
			{!loading && (
				<div className="mb-6 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						{totalCount === 0 ? (
							'No products found'
						) : (
							<>
								Showing{' '}
								<span className="font-medium text-foreground">
									{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
									{Math.min(currentPage * PRODUCTS_PER_PAGE, totalCount)}
								</span>{' '}
								of <span className="font-medium text-foreground">{totalCount}</span>{' '}
								products
							</>
						)}
					</p>
				</div>
			)}

			{/* Product Grid */}
			{loading ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
						<div
							key={i}
							className="animate-pulse overflow-hidden rounded-xl border border-border bg-card"
						>
							<div className="h-56 bg-muted" />
							<div className="space-y-3 p-5">
								<div className="h-5 w-3/4 rounded bg-muted" />
								<div className="flex items-center justify-between">
									<div className="h-6 w-1/3 rounded bg-muted" />
									<div className="h-4 w-1/4 rounded bg-muted" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : products.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20">
					<svg
						className="mb-4 h-16 w-16 text-muted-foreground/50"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1}
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
						/>
					</svg>
					<h3 className="text-lg font-medium text-muted-foreground">No products found</h3>
					<p className="mt-1 text-sm text-muted-foreground/70">
						Try adjusting your search or filter criteria
					</p>
					{(searchQuery || selectedCategory) && (
						<Button
							variant="outline"
							className="mt-4"
							onClick={() => {
								setSearchQuery('');
								setSelectedCategory('');
							}}
						>
							Clear Filters
						</Button>
					)}
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{products.map((product, index) => (
						<div
							key={product._id}
							className="animate-fade-in-up"
							style={{ animationDelay: `${index * 60}ms` }}
						>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && !loading && (
				<nav className="mt-12 flex items-center justify-center" aria-label="Pagination">
					<div className="flex items-center gap-1.5">
						{/* Previous Button */}
						<button
							id="pagination-prev"
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium transition-all duration-200 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="h-4 w-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 19.5 8.25 12l7.5-7.5"
								/>
							</svg>
							<span className="hidden sm:inline">Previous</span>
						</button>

						{/* Page Numbers */}
						{getPaginationRange().map((page, index) =>
							page === '...' ? (
								<span
									key={`ellipsis-${index}`}
									className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground"
								>
									⋯
								</span>
							) : (
								<button
									key={page}
									id={`pagination-page-${page}`}
									onClick={() => handlePageChange(page)}
									className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
										currentPage === page
											? 'bg-primary text-primary-foreground shadow-md'
											: 'border border-border hover:bg-muted'
									}`}
								>
									{page}
								</button>
							)
						)}

						{/* Next Button */}
						<button
							id="pagination-next"
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium transition-all duration-200 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
						>
							<span className="hidden sm:inline">Next</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="h-4 w-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m8.25 4.5 7.5 7.5-7.5 7.5"
								/>
							</svg>
						</button>
					</div>
				</nav>
			)}
		</main>
	);
};

export default Shop;
