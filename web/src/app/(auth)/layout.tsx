import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // tentuin semua yang bakal dipakai
  variable: "--font-poppins", // biar bisa dipakai di CSS juga kalau mau
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={poppins.className + " flex justify-center items-center min-h-screen bg-gray-50"}>
      {children}
    </div>
  );
}
