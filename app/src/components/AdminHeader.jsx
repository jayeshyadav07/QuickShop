import { useLocation, useNavigate } from 'react-router';

const adminNavigation = [
	{ label: 'Dashboard', path: '/admin' },
	{ label: 'Add Product', path: '/admin/add-product' },
	{ label: 'Products', path: '/admin/products' },
	{ label: 'Orders', path: '/admin/orders' },
	{ label: 'Users', path: '/admin/users' },
];

const AdminHeader = () => {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div className="mb-8 flex flex-wrap gap-2 border-b pb-6">
			{adminNavigation.map((item) => {
				const isActive = location.pathname === item.path;

				return (
					<button
						key={item.path}
						type="button"
						onClick={() => navigate(item.path)}
						className={`rounded-full border px-4 py-2 text-sm transition-colors ${
							isActive
								? 'border-foreground bg-foreground text-background'
								: 'text-muted-foreground hover:bg-muted'
						}`}
					>
						{item.label}
					</button>
				);
			})}
		</div>
	);
};

export default AdminHeader;
