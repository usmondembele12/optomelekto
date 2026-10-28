"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Settings,
  ExternalLink,
  Zap,
  LogOut,
  Database,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    {
      href: "/admin",
      label: "Boshqaruv Paneli",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/buyurtmalar",
      label: "Buyurtmalar",
      icon: ShoppingBag,
    },
    {
      href: "/admin/mahsulotlar",
      label: "Mahsulotlar",
      icon: Package,
    },
    {
      href: "/admin/kategoriyalar",
      label: "Kategoriyalar",
      icon: Layers,
    },
    {
      href: "/admin/sozlamalar",
      label: "Telegram & Sozlamalar",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight">
                OPTOM<span className="text-amber-500">ELEKTRO</span>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Backend Boshqaruv
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Store Link & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <span>Do'konni ochish</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold transition"
        >
          <span>Tizimdan chiqish</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
