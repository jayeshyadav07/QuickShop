import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';

const Home = () => {
	return (
		<main className="container mx-auto min-h-[80vh] px-6">
			{/* Hero Section */}
			<Hero />
			{/* Products Section */}
			<ProductSection />
		</main>
	);
};

export default Home;
