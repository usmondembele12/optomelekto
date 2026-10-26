import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { Zap, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Admin Panel — Optom Elektro Toshkent",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Admin Nav Bar */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-current" />
            <span className="font-black text-sm">OPTOM ELEKTRO ADMIN</span>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/admin/buyurtmalar"
              className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300"
            >
              Buyurtmalar
            </Link>
            <Link
              href="/admin/sozlamalar"
              className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg"
            >
              Telegram
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
