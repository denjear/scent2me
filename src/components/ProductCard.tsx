import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  imageUrl: string;
  name: string;
  brand: string;
  price: string;
  tags: string;
};

export default function ProductCard({ imageUrl, name, brand, price, tags }: ProductCardProps) {
  return (
    // Kontainer kartu utama
    <div className="bg-white rounded-2xl shadow-md p-5 flex gap-5 items-center w-full max-w-sm">
      
      {/* Gambar Produk */}
      <div className="flex-shrink-0">
        <Image
          src={imageUrl}
          alt={`Image of ${name}`}
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Detail Teks Produk */}
      <div className="flex flex-col flex-grow h-full">
        <h3 className="text-lg font-bold text-[#4B4B4B]">{name}</h3>
        <p className="text-sm text-gray-500 uppercase">{brand}</p>
        <p className="text-md text-gray-700 mt-1">{price}</p>
        <p className="text-sm font-bold text-[#4B4B4B] mt-1">{tags}</p>
        
        <div className="mt-auto">
          <Link
            href="/product/detail"
            className="bg-[#A3B899] text-white text-sm font-semibold px-4 py-1.5 rounded-md
                       hover:bg-[#93a78a] transition-colors inline-block mt-2"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}