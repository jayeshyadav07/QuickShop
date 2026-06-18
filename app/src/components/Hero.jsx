import React, { useContext } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/AuthContext';

const Hero = () => {
	const { user } = useContext(AuthContext);
	return (
		<section className="flex min-h-[75vh] flex-col items-center justify-center rounded-2xl bg-white px-6 text-center">
			<h1 className="mb-6 text-5xl font-extrabold tracking-tight text-black md:text-6xl">
				Welcome to <span className="text-zinc-700">QuickShop</span>
			</h1>

			<p className="mb-10 max-w-3xl text-lg leading-8 text-zinc-600 md:text-xl">
				Discover premium products, unbeatable deals, and a seamless shopping experience—all
				in one place.
			</p>

			<div className="flex flex-wrap justify-center gap-4">
				<Button asChild size="lg">
					<Link to="/shop">Shop Now</Link>
				</Button>

				<Button asChild variant="outline" size="lg">
					{user ? (
						<Link to="/order">Go to Dashboard</Link>
					) : (
						<Link to="/login">Login</Link>
					)}
				</Button>
			</div>
		</section>
	);
};

export default Hero;
