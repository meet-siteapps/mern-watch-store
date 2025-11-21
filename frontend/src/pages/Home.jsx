import Hero from "../components/Hero.jsx";
import MainProducts from "../components/HomeProducts.jsx";
import BrandsAbout from "../components/BrandsAbout.jsx";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <MainProducts />

      {/* About & Brands */}
      <BrandsAbout />


    </div>
  );
}
