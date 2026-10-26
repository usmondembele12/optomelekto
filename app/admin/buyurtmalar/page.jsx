"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Send,
  Phone,
  MapPin,
  Clock,
  User,
  CreditCard,
  CheckCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [resending, setResending] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        setAlertMsg({ type: "success", text: "Buyurtma holati yangilandi!" });
        setTimeout(() => setAlertMsg(null), 3000);
      }
    } catch (e) {
      setAlertMsg({ type: "error", text: "Xatolik: " + e.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleResendTelegram = async (orderId) => {
    setResending(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.telegram?.success) {
        setAlertMsg({
          type: "success",
          text: "Buyurtma ma'lumotlari Telegram bot orqali muvaffaqiyatli qayta yuborildi!",
        });
      } else {
        setAlertMsg({
          type: "error",
          text:
            data.telegram?.error ||
            data.telegram?.warning ||
            "Telegramga yuborib bo'lmadi. Bot sozlamalarini tekshiring.",
        });
      }
      setTimeout(() => setAlertMsg(null), 5000);
    } catch (e) {
      setAlertMsg({ type: "error", text: e.message });
    } finally {
      setResending(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = order.id?.toLowerCase().includes(q);
      const matchName = order.customerName?.toLowerCase().includes(q);
      const matchPhone = order.phone?.toLowerCase().includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Buyurtmalar Boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Saytdan kelib tushgan barcha mijozlar buyurtmalari
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {alertMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold ${
            alertMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {alertMsg.text}
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Mijoz ismi, telefon yoki buyurtma ID bo'yicha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["all", "Yangi", "Qabul qilingan", "Yetkazilmoqda", "Yakunlangan", "Bekor qilingan"].map(
            (status) => {
              const isSelected = statusFilter === status;
              const count =
                status === "all"
                  ? orders.length
                  : orders.filter((o) => o.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status === "all" ? "Barchasi" : status} ({count})
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Buyurtmalar yuklanmoqda...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Hech qanday buyurtma topilmadi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Mijoz</th>
                  <th className="py-3.5 px-6">Telefon</th>
                  <th className="py-3.5 px-6">Manzil</th>
                  <th className="py-3.5 px-6">Summa</th>
                  <th className="py-3.5 px-6">To'lov</th>
                  <th className="py-3.5 px-6">Holat</th>
                  <th className="py-3.5 px-6 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-amber-50/40 transition cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {order.id}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {order.customerName}
                    </td>
                    <td className="py-4 px-6">{order.phone}</td>
                    <td className="py-4 px-6 max-w-[200px] truncate">
                      {order.district} {order.address && `, ${order.address}`}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="py-4 px-6 text-[11px]">
                      {order.paymentMethod}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.status === "Yangi"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : order.status === "Yakunlangan"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "Bekor qilingan"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status || "Yangi"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-black text-amber-400">
                  {selectedOrder.id}
                </span>
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full font-bold">
                  {selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Customer info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Mijoz:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedOrder.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Telefon:</span>
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="font-black text-amber-600 text-sm hover:underline"
                  >
                    {selectedOrder.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Manzil:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrder.district} — {selectedOrder.address || "Ko'rsatilmagan"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">To'lov turi:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
                {selectedOrder.notes && (
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block font-medium">Mijoz izohi:</span>
                    <span className="text-slate-700 italic">"{selectedOrder.notes}"</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  Buyurtma tarkibi ({selectedOrder.items?.length || 0} tovar)
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4 text-left">Mahsulot</th>
                        <th className="py-2.5 px-4 text-center">Miqdor</th>
                        <th className="py-2.5 px-4 text-right">Narx</th>
                        <th className="py-2.5 px-4 text-right">Jami</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {item.name}
                            {item.isWholesale && (
                              <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                Optom
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-bold">
                            {item.quantity} {item.unit || "dona"}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-600">
                            {formatPrice(item.price)}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">
                            {formatPrice(item.subtotal || item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-black text-sm">
                      <tr>
                        <td colSpan="3" className="py-3 px-4 text-right text-slate-700">
                          Jami to'lov:
                        </td>
                        <td className="py-3 px-4 text-right text-amber-600">
                          {formatPrice(selectedOrder.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status Update & Actions */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Buyurtma holatini o'zgartirish:
                    </label>
                    <select
                      value={selectedOrder.status}
                      disabled={updating}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder.id, e.target.value)
                      }
                      className="px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Yangi">Yangi</option>
                      <option value="Qabul qilingan">Qabul qilingan</option>
                      <option value="Yetkazilmoqda">Yetkazilmoqda</option>
                      <option value="Yakunlangan">Yakunlangan</option>
                      <option value="Bekor qilingan">Bekor qilingan</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={resending}
                    onClick={() => handleResendTelegram(selectedOrder.id)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>{resending ? "Yuborilmoqda..." : "Telegramga qayta yuborish"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
