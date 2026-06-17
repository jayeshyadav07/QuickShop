import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import ProductDetails from './components/ProductDetails';

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/product/:id" element={<ProductDetails />} />
				<Route path="/shop" element={<Shop />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
