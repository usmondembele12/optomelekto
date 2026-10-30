"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  MapPin,
  ShoppingBag,
  Package,
  Clock,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Edit3,
  Save,
  ArrowRight,
  ExternalLink,
  Send,
  Loader2,
  Calendar,
  Receipt,
  Truck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/lib/utils";

const ACTIVITY_OPTIONS = [
  { id: "Usta / Elektrik", label: "⚡ Usta / Elektrik" },
  { id: "Do'kon / Savdogar", label: "🏪 Do'kon / Savdogar" },
  { id: "Qurilish kompaniyasi", label: "🏗️ Qurilish kompaniyasi" },
  { id: "Jismoniy shaxs", label: "👤 Jismoniy shaxs (Uy uchun)" },
];

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'profile' | 'terms'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [activityType, setActivityType] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setActivityType(user.activityType || "Usta / Elektrik");
      setCity(user.city || "Toshkent shahri");
      setAddress(user.address || "");

      // Fetch user's orders
      fetch("/api/user/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data?.orders) {
            setOrders(data.orders);
          }
        })
        .catch((err) => console.error("Orders load error:", err))
        .finally(() => setOrdersLoading(false));
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, activityType, city, address }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Xatolik yuz berdi");
      }
      setProfileMsg({ text: "Ma'lumotlar muvaffaqiyatli saqlandi!", type: "success" });
      setTimeout(() => setProfileMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      setProfileMsg({ text: err.message, type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  if (authLoading || (!user && typeof window !== "undefined")) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-amber-400 text-sm font-semibold">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Shaxsiy kabinet yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status === "Yangi" || o.status === "Yetkazilmoqda"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Header Card */}
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Profile Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-amber-500/20 shrink-0">
                {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    {user?.fullName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3 h-3" />
                    {user?.activityType || "A'zo mijoz"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-3">
                  <span className="font-mono text-amber-400">{user?.phone}</span>
                  <span>•</span>
                  <span>{user?.city || "Toshkent shahri"}</span>
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ Ulgurji 1-qo'l zavod narxlari faollashtirilgan
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/katalog"
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition"
              >
                <Zap className="w-4 h-4" />
                <span>Katalogga o'tish</span>
              </Link>
              <Link
                href="/savat"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Savatcha</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Tizimdan chiqish"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Jami Buyurtmalar</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {orders.length} ta
            </div>
            <p className="text-[11px] text-slate-500">Optom Elektro orqali</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Jami Xaridlar</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 truncate">
              {formatPrice(totalSpent)}
            </div>
            <p className="text-[11px] text-slate-500">Barcha davr mobaynida</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Faol Buyurtmalar</span>
              <Truck className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-sky-600">
              {activeOrdersCount} ta
            </div>
            <p className="text-[11px] text-slate-500">Yetkazilishi kutilmoqda</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Mijoz Maqomi</span>
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-lg sm:text-xl font-black text-indigo-600 truncate">
              1-Qo'l Ulgurji
            </div>
            <p className="text-[11px] text-slate-500">Maxsus chegirmali narxlar</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Mening Buyurtmalarim ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "profile"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Shaxsiy Ma'lumotlar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "terms"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Ulgurji Shartlar va Aloqa</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="p-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                <span>Buyurtmalaringiz yuklanmoqda...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Sizda hali buyurtmalar mavjud emas
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Katalogimizdagi kabellar, avtomatika va LED yoritish vositalarini ulgurji narxlarda xarid qiling.
                </p>
                <div className="pt-2">
                  <Link
                    href="/katalog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition"
                  >
                    <span>Katalogga o'tish</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 transition hover:border-amber-400"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-base font-mono">
                              #{order.id}
                            </h4>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                order.status === "Yangi"
                                  ? "bg-amber-100 text-amber-900"
                                  : order.status === "Yetkazilmoqda"
                                  ? "bg-blue-100 text-blue-900"
                                  : order.status === "Yakunlangan"
                                  ? "bg-emerald-100 text-emerald-900"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {order.status || "Qabul qilindi"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(order.createdAt).toLocaleString("uz-UZ", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400">Jami to'lov:</p>
                        <p className="text-lg font-black text-slate-900">
                          {formatPrice(order.totalAmount || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="py-4 space-y-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Mahsulotlar tarkibi:
                      </p>
                      <div className="divide-y divide-slate-100">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-2 flex items-center justify-between text-xs sm:text-sm"
                          >
                            <span className="text-slate-800 font-medium">
                              {item.name}
                            </span>
                            <span className="text-slate-500 shrink-0 ml-4 font-mono">
                              {item.quantity} {item.unit || "dona"} × {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details Footer */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {order.district} {order.address ? `(${order.address})` : ""}
                        </span>
                      </div>
                      <div className="text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-lg">
                        To'lov: {order.paymentMethod || "Naqd yetkazilganda"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Shaxsiy ma'lumotlarni tahrirlash
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Buyurtma berishda ushbu ma'lumotlar avtomatik to'ldiriladi.
            </p>

            {profileMsg.text && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ism va Familiyangiz *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Telefon raqam (O'zgartirib bo'lmaydi)
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.phone || ""}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Faoliyat turi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIVITY_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActivityType(item.id)}
                      className={`px-3 py-2 text-xs rounded-xl border text-left font-medium transition ${
                        activityType === item.id
                          ? "bg-amber-50 border-amber-500 text-amber-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Shahar / Hudud
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Masalan, Toshkent sh., Chilonzor tumani"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Yetkazib berishning asosiy manzili
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ko'cha, uy, xonadon yoki mo'ljal"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>O'zgarishlarni saqlash</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Wholesale Terms & Contacts */}
        {activeTab === "terms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Ulgurji Mijoz Imtiyozlari
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>1-qo'l zavod narxlari:</strong> Saytdagi barcha kabellar va avtomatika vositalari eng arzon ulgurji narxda hisoblanadi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Bepul yetkazib berish:</strong> Toshkent shahri bo'ylab 1 000 000 so'mdan yuqori buyurtmalar bepul yetkaziladi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>QQS va hisob-faktura:</strong> Yuridik shaxslar uchun shartnoma asosida rasmiy hisob-faktura beriladi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>100% GOST sertifikati:</strong> Barcha mahsulotlar kafolatlangan va sertifikatlangan.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-sm p-6 sm:p-8 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Shaxsiy Menejer Aloqasi
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Katta hajmdagi ulgurji buyurtmalar yoki maxsus talablar bo'yicha bog'laning:
                </p>
              </div>

              <div className="space-y-3 pt-2 text-sm">
                <a
                  href="tel:+998712004545"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">+998 71 200 45 45</span>
                </a>
                <a
                  href="https://t.me/optomelektro_admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/40 text-sky-300 transition"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Telegram Menejer (@optomelektro_admin)</span>
                </a>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>08:30 - 18:30 (Dam olish kunlarisiz)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

