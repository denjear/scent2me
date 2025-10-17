'use client';

import Image from 'next/image';

export default function ProductDetailPage() {
  // Static data for now
  const product = {
    name: 'Rose Lumiere',
    designer: 'ARMAND BASI',
    price: 'Rp. 500.000',
    notes: ['Floral', 'Citrus', 'Rose', 'Woody', 'Musk'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    compound: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    images: [
      '/images/parfumdummy.jpg',
      '/images/parfumdummy.jpg',
      '/images/parfumdummy2.jpg',
    ],
  };

  return (
    <div className="bg-[#F9F6F1] min-h-screen py-12 px-30">
      <div className="container mx-auto flex flex-col gap-12">
        {/* Top Row: Image and Product Info */}
        <div className="flex gap-12 items-center">
          {/* Vertical Product Slider */}
          <div className="w-20 flex flex-col gap-3 justify-center">
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1} of ${product.name}`}
                width={80}
                height={80}
                className="object-contain rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              />
            ))}
          </div>

          {/* Main Picture */}
          <div className="flex-1 bg-white h-96 flex justify-center items-center max-w-md rounded-lg">
            <Image
              src={product.images[0]}
              alt={`Main image of ${product.name}`}
              width={350}
              height={350}
              className="object-contain rounded-lg shadow-md"
            />
          </div>

          {/* Empty Spacer */}
          <div className="w-12"></div>

          {/* Product Info */}
          <div className="flex-1 self-start">
            <h1 className="text-5xl font-bold text-[#4B4B4B] mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-15">
              {product.designer}
            </p>

            <p className="text-xl font-semibold text-gray-800 mb-8">
              {product.price}
            </p>

            <h3 className="text-lg font-bold text-[#4B4B4B] mb-4">Notes</h3>
            <div className="flex flex-wrap gap-3">
              {product.notes.map((note, index) => (
                <span
                  key={index}
                  className="bg-[#A3B899] text-white font-bold px-15 py-2 rounded-lg text-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: About and Compound */}
        <div className="flex gap-12">
          {/* Empty Spacer */}
          <div className="w-20"></div>

          {/* About */}
          <div className="flex-1 max-w-md">
            <h2 className="text-xl font-bold text-[#4B4B4B] mb-4">
              About {product.name}
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Empty Spacer */}
          <div className="w-12"></div>

          {/* Compound */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#4B4B4B] mb-4">
              Compound
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {product.compound}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
