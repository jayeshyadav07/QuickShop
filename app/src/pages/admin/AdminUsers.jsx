import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/context/AuthContext';
import { API_PATHS } from '@/utils/api';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const getRoleClassName = (role) => {
	return role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-muted text-muted-foreground';
};

const AdminUsers = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user || user.role !== 'admin') {
			navigate('/');
			return;
		}

		const fetchUsers = async () => {
			try {
				setLoading(true);
				const res = await axios.get(API_PATHS.AUTH.USERS, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				setUsers(res.data);
			} catch (error) {
				console.log(error);
				toast.error(error.response?.data?.message || 'Failed to fetch users');
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, [user, navigate]);

	if (loading) {
		return (
			<div className="flex min-h-[80vh] items-center justify-center px-4">
				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" />
					Loading users...
				</div>
			</div>
		);
	}

	if (!users || users.length === 0) {
		return (
			<div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center px-4">
				<div className="text-center">
					<h1 className="text-2xl font-semibold tracking-tight">No users found</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Registered users will appear here.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[80vh] bg-background px-4 py-10 sm:px-6">
			<div className="mx-auto max-w-5xl">
				<AdminHeader />

				<div className="mb-8 border-b pb-6">
					<h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
					<p className="mt-2 text-sm text-muted-foreground sm:text-base">
						List of registered accounts in the store.
					</p>
					<p className="mt-3 text-sm font-semibold text-muted-foreground">
						{users.length} total user{users.length === 1 ? '' : 's'}
					</p>
				</div>

				<div className="grid gap-4">
					{users.map((account) => (
						<Card key={account._id}>
							<CardHeader className="border-b">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<CardTitle className="text-lg">{account.name}</CardTitle>
										<CardDescription className="mt-2">
											{account.email}
										</CardDescription>
									</div>
									<span
										className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleClassName(account.role)}`}
									>
										{account.role}
									</span>
								</div>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="grid gap-4 sm:grid-cols-3">
									<div>
										<p className="text-sm text-muted-foreground">Role</p>
										<p className="mt-1 font-medium capitalize">
											{account.role}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Verified</p>
										<p className="mt-1 font-medium">
											{account.verified ? 'Yes' : 'No'}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Joined</p>
										<p className="mt-1 font-medium">
											{new Date(account.createdAt).toLocaleDateString(
												'en-US',
												{
													year: 'numeric',
													month: 'short',
													day: 'numeric',
												}
											)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default AdminUsers;
