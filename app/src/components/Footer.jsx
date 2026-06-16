import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
	return (
		<footer className="border-t bg-background">
			<div className="container mx-auto px-6 py-10">
				<div className="grid gap-8 md:grid-cols-3">
					{/* Brand */}
					<div>
						<h2 className="text-xl font-bold text-primary">QuickShop</h2>
						<p className="mt-3 text-sm text-muted-foreground">
							Your one-stop destination for quality products at affordable prices.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="mb-3 text-lg font-semibold">Quick Links</h3>

						<div className="flex flex-col gap-2">
							<Link
								to="/shop"
								className="text-sm text-muted-foreground hover:text-primary"
							>
								Shop
							</Link>

							<Link
								to="/about"
								className="text-sm text-muted-foreground hover:text-primary"
							>
								About Us
							</Link>

							<Link
								to="/return"
								className="text-sm text-muted-foreground hover:text-primary"
							>
								Return Policy
							</Link>

							<Link
								to="/disclaimer"
								className="text-sm text-muted-foreground hover:text-primary"
							>
								Disclaimer
							</Link>
						</div>
					</div>

					{/* Contact */}
					<div>
						<h3 className="mb-3 text-lg font-semibold">Contact</h3>

						<div className="space-y-2 text-sm text-muted-foreground">
							<p>Email: support@quickshop.com</p>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
					© {new Date().getFullYear()} QuickShop. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
