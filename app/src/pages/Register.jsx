import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_PATHS } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name || !email || !password) {
			toast.warning('Please fill in all fields');
			return;
		}

		try {
			setLoading(true);
			const res = await axios.post(API_PATHS.AUTH.REGISTER, { name, email, password });
			login(res.data.user || res.data); // Auto-login user if the API returns user details
			toast.success('Registration successful!');
			navigate('/');
		} catch (error) {
			console.error(error);
			toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold tracking-tight text-center">
						Create an Account
					</CardTitle>
					<CardDescription className="text-center">
						Enter your name, email, and password to sign up
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium leading-none">
								Full Name
							</label>
							<input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
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
							<label htmlFor="password" className="text-sm font-medium leading-none">
								Password
							</label>
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
							{loading ? 'Creating account...' : 'Sign Up'}
						</Button>
					</form>
					<div className="mt-4 text-center text-sm">
						Already have an account?{' '}
						<Link
							to="/login"
							className="text-primary underline-offset-4 hover:underline"
						>
							Log in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Register;
