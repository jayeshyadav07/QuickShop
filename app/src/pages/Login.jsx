import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_PATHS } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			toast.warning('Please fill in all fields');
			return;
		}

		try {
			setLoading(true);
			const res = await axios.post(API_PATHS.AUTH.LOGIN, { email, password });
			login(res.data.user || res.data); // handles both nested and direct structure
			toast.success('Successfully logged in!');
			navigate('/');
		} catch (error) {
			console.error(error);
			toast.error(
				error.response?.data?.message || 'Login failed. Please check your credentials.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold tracking-tight text-center">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-center">
						Enter your email and password to log in to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium leading-none">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="text-sm font-medium leading-none"
								>
									Password
								</label>
							</div>
							<input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
						<Button type="submit" className="w-full mt-2" disabled={loading}>
							{loading ? 'Logging in...' : 'Log In'}
						</Button>
					</form>
					<div className="mt-4 text-center text-sm">
						Don't have an account?{' '}
						<Link
							to="/register"
							className="text-primary underline-offset-4 hover:underline"
						>
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
