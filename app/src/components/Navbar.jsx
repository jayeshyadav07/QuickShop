import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

const Navbar = () => {
	const navigate = useNavigate();
	return (
		<nav className="border-b bg-background">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link to="/" className="flex items-center gap-2 text-xl font-bold">
					<div>
						<span>QuickShop</span>
					</div>
				</Link>
				{/* Navigation */}
				<div className="flex items-center gap-6">
					<Link
						to="/shop"
						className="text-sm font-medium hover:text-primary transition-colors"
					>
						Shop
					</Link>

					<Link
						to="/cart"
						className="text-sm font-medium hover:text-primary transition-colors"
					>
						Cart
					</Link>
					<Button asChild size="sm">
						<Link to="/login">Login</Link>
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
