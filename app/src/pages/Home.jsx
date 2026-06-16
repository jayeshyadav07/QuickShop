import React from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

const Home = () => {
	return (
		<main className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
			<h1 className="mb-4 text-5xl font-bold tracking-tight">
				Welcome to <span className="text-primary">ShopNest</span>
			</h1>

			<p className="mb-8 max-w-2xl text-lg text-muted-foreground">
				Discover the latest products at the best prices. Shop with confidence and enjoy a
				seamless online shopping experience.
			</p>

			<div className="flex gap-4">
				<Button asChild size="lg">
					<Link to="/shop">Shop Now</Link>
				</Button>

				<Button asChild variant="outline" size="lg">
					<Link to="/login">Login</Link>
				</Button>
			</div>
		</main>
	);
};

export default Home;
