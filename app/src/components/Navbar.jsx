import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSelector } from 'react-redux';

const Navbar = () => {
	const { user, logout } = useContext(AuthContext);
	const cartItems = useSelector((state) => state.cart.cartItems);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
	};

	return (
		<header className="sticky top-0 z-50 border-b bg-background">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<Link to="/" className="text-2xl font-bold tracking-tight text-primary">
					QuickShop
				</Link>

				{/* Navigation */}
				<div className="flex items-center gap-6">
					<Link
						to="/"
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						Home
					</Link>

					<Link
						to="/shop"
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						Shop
					</Link>

					<Link
						to="/cart"
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						Cart ({cartItems.length})
					</Link>

					{user ? (
						<>
							<span className="text-sm text-muted-foreground">
								<Link
									to={`/order`}
									className="hover:text-foreground transition-colors"
								>
									Hi, <span className="font-medium">{user.name}</span>
								</Link>
							</span>

							{user.role === 'admin' && (
								<Button asChild variant="secondary" size="sm">
									<Link to="/admin">Admin</Link>
								</Button>
							)}

							<Button
								variant="outline"
								size="sm"
								onClick={handleLogout}
								className="cursor-pointer"
							>
								Logout
							</Button>
						</>
					) : (
						<Button asChild size="sm">
							<Link to="/login">Login</Link>
						</Button>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
