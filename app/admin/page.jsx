import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Layers,
  Send,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Plus,
  Users,
} from "lucide-react";
import { getOrders, getProducts, getCategories, getSettings, getUsers } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const orders = await getOrders();
  const products = await getProducts();
  const categories = await getCategories();
  const settings = await getSettings();
  const users = await getUsers();

  const newOrdersCount = orders.filter((o) => o.status === "Yangi").length;
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const isTelegramConfigured = Boolean(
    settings.telegramBotToken && settings.telegramChatId
  );

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Boshqaruv Paneli
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            "Optom Elektro Toshkent" do'koni va buyurtmalar statistikasi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/mahsulotlar"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi mahsulot</span>
          </Link>
          <Link
            href="/admin/sozlamalar"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span>Telegram Bot</span>
          </Link>
        </div>
      </div>

      {/* Telegram Status Banner */}
      {isTelegramConfigured ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">
                Telegram Bot Faol va Ishlamoqda
              </h4>
              <p className="text-[11px] text-emerald-700">
                Mijozlar buyurtma berganda ma'lumotlar avtomatik Telegram chatiga yuboriladi.
              </p>
            </div>
          </div>
          <Link
            href="/admin/sozlamalar"
            className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
          >
            Sozlamalar
          </Link>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Telegram Bot hali ulanmagan!
              </h4>
              <p className="text-[11px] text-amber-800">
                Buyurtmalarni Telegramingizga qabul qilish uchun Bot Token va Chat ID ni kiriting.
              </p>
            </div>
          </div>
          <Link
            href="/admin/sozlamalar"
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm shrink-0"
          >
            Hozir sozlash
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Yangi Buyurtmalar
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
              !
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {newOrdersCount}
          </div>
          <p className="text-[11px] text-slate-500">
            Ko'rib chiqilishi kutilmoqda
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Jami Buyurtmalar
            </span>
            <ShoppingBag className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {orders.length}
          </div>
          <p className="text-[11px] text-slate-500">
            Barcha davr mobaynida
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              A'zo Mijozlar
            </span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {users.length}
          </div>
          <p className="text-[11px] text-slate-500">
            Ro'yxatdan o'tgan mijozlar
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Jami Savdo
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 truncate">
            {formatPrice(totalSales)}
          </div>
          <p className="text-[11px] text-slate-500">
            Barcha buyurtmalar summasi
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Mahsulotlar
            </span>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {products.length}
          </div>
          <p className="text-[11px] text-slate-500">
            {categories.length} ta kategoriya bo'yicha
          </p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Oxirgi Buyurtmalar
            </h3>
            <p className="text-xs text-slate-500">
              Yangi kelib tushgan buyurtmalar ro'yxati
            </p>
          </div>
          <Link
            href="/admin/buyurtmalar"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Barchasini ko'rish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Xaridor</th>
                <th className="py-3 px-6">Telefon</th>
                <th className="py-3 px-6">Mahsulotlar soni</th>
                <th className="py-3 px-6">Summa</th>
                <th className="py-3 px-6">Holat</th>
                <th className="py-3 px-6 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    {order.id}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {order.customerName}
                  </td>
                  <td className="py-4 px-6">{order.phone}</td>
                  <td className="py-4 px-6">
                    {order.items?.length || 0} xil tovar
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.status === "Yangi"
                          ? "bg-amber-100 text-amber-900"
                          : order.status === "Yakunlangan"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status || "Yangi"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/buyurtmalar`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ko'rish</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
