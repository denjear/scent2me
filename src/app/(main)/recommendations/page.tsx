import Link from 'next/link';

export default function RecommendationsPage() {
  return (
    <div className="bg-[#F9F6F1] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#4B4B4B] mb-8">
          Ubah di /Reccomendation/page.tsx ya
        </h1>
        <Link
          href="/recommendations/results"
          className="bg-[#A3B899] text-white font-bold px-8 py-4 rounded-lg text-lg
                     hover:bg-[#93a78a] transition-colors"
        >
          tombol ke results rekom
        </Link>
      </div>
    </div>
  );
}
