import ProductCard from '@/components/ProductCard';

// Ini adalah data dummy. Nanti, data ini akan datang dari API.
const recommendedProducts = [
  {
    imageUrl: '/images/parfumdummy.jpg',
    name: 'Rose Lumiere',
    brand: 'ARMAND BASI',
    price: 'Rp. 500.000',
    tags: 'Floral, Citrus',
  },
  {
    imageUrl: '/images/parfumdummy.jpg',
    name: 'Rose Lumiere',
    brand: 'ARMAND BASI',
    price: 'Rp. 500.000',
    tags: 'Floral, Citrus',
  },
  {
    imageUrl: '/images/parfumdummy.jpg',
    name: 'Rose Lumiere',
    brand: 'ARMAND BASI',
    price: 'Rp. 500.000',
    tags: 'Floral, Citrus',
  },
];

export default function RecommendationResultsPage() {
  return (
    <div className="bg-[#F9F6F1] min-h-screen">
      <div className="container mx-auto px-6 py-12 flex flex-col items-center">

        {/* === Bagian Header === */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#4B4B4B]">
            Recomendation For You
          </h1>
          <p className="mt-2 text-md text-gray-500">
            Based on your preferences, this is your perfume
          </p>
        </div>

        {/* === Grid Kartu Produk === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recommendedProducts.map((product, index) => (
            <ProductCard
              key={index}
              imageUrl={product.imageUrl}
              name={product.name}
              brand={product.brand}
              price={product.price}
              tags={product.tags}
            />
          ))}
        </div>

        {/* === Tombol Aksi Utama === */}
        <button
          className="bg-[#A3B899] text-white font-bold px-8 py-4 rounded-lg text-lg
                     hover:bg-[#93a78a] transition-colors"
        >
          Save Recommendation
        </button>

      </div>
      
      {/* === Footer === */}
      <footer className="text-center py-8">
        <p className="text-sm text-gray-500">Scent2Me © 2025 All Rights Reserved.</p>
      </footer>
    </div>
  );
}