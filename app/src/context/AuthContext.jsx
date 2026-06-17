import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('user');
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const login = async (userData) => {
		localStorage.setItem('user', JSON.stringify(userData));
		setUser(userData);
	};

	const logout = async () => {
		localStorage.removeItem('user');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
