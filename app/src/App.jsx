import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './components/ProductDetails';
import Checkout from './pages/Checkout';
import Order from './pages/Order';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/product/:id" element={<ProductDetails />} />
				<Route path="/shop" element={<Shop />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/order" element={<Order />} />
				<Route path="/admin" element={<AdminDashboard />} />
				<Route path="/admin/add-product" element={<AdminAddProduct />} />
				<Route path="/admin/products" element={<AdminProducts />} />
				<Route path="/admin/orders" element={<AdminOrders />} />
				<Route path="/admin/users" element={<AdminUsers />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
