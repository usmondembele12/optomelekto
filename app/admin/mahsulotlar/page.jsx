"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Eye,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Form State
  const [form, setForm] = useState({
    id: "",
    name: "",
    categoryId: "kabel-simlar",
    brand: "Optom Elektro",
    sku: "",
    price: "",
    wholesalePrice: "",
    minWholesaleQty: 10,
    unit: "metr",
    stock: 100,
    badge: "",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80",
    shortDescription: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProd, resCat] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      if (dataProd.success) setProducts(dataProd.products || []);
      if (dataCat.success) setCategories(dataCat.categories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      id: `prod-${Date.now()}`,
      name: "",
      categoryId: categories[0]?.id || "kabel-simlar",
      brand: "O'zkabel",
      sku: `OE-${Math.floor(100 + Math.random() * 900)}`,
      price: "",
      wholesalePrice: "",
      minWholesaleQty: 10,
      unit: "metr",
      stock: 500,
      badge: "Xaridorgir",
      isFeatured: true,
      image:
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80",
      shortDescription: "",
      description: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setForm({
      id: prod.id,
      name: prod.name,
      categoryId: prod.categoryId,
      brand: prod.brand || "",
      sku: prod.sku || "",
      price: prod.price,
      wholesalePrice: prod.wholesalePrice || prod.price,
      minWholesaleQty: prod.minWholesaleQty || 10,
      unit: prod.unit || "dona",
      stock: prod.stock || 100,
      badge: prod.badge || "",
      isFeatured: Boolean(prod.isFeatured),
      image: prod.image || "",
      shortDescription: prod.shortDescription || "",
      description: prod.description || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Haqiqatan ham ushbu mahsulotni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setAlertMsg({ type: "success", text: "Mahsulot o'chirildi!" });
        setTimeout(() => setAlertMsg(null), 3000);
      }
    } catch (e) {
      setAlertMsg({ type: "error", text: e.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const categoryObj = categories.find((c) => c.id === form.categoryId);
      const payload = {
        ...form,
        categoryName: categoryObj?.name || "Boshqa",
        price: Number(form.price),
        wholesalePrice: Number(form.wholesalePrice) || Number(form.price),
        minWholesaleQty: Number(form.minWholesaleQty) || 10,
        stock: Number(form.stock) || 0,
      };

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
          setAlertMsg({ type: "success", text: "Mahsulot yangilandi!" });
        } else {
          setProducts((prev) => [data.product, ...prev]);
          setAlertMsg({ type: "success", text: "Yangi mahsulot qo'shildi!" });
        }
        setModalOpen(false);
        setTimeout(() => setAlertMsg(null), 3000);
      } else {
        throw new Error(data.error || "Xatolik yuz berdi");
      }
    } catch (e) {
      alert("Xatolik: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "all" && p.categoryId !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      return matchName || matchBrand || matchSku;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Mahsulotlar Boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Katalogdagi barcha tovarlar, chakana va ulgurji narxlar
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Mahsulot Qo'shish</span>
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

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Nom, brend yoki artikul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Barchasi ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCategory === c.id
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Mahsulotlar yuklanmoqda...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Mahsulotlar topilmadi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Tovar</th>
                  <th className="py-3.5 px-6">Kategoriya</th>
                  <th className="py-3.5 px-6">Chakana narx</th>
                  <th className="py-3.5 px-6">Ulgurji narx</th>
                  <th className="py-3.5 px-6">Ombor zaxirasi</th>
                  <th className="py-3.5 px-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-xl bg-slate-100 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 leading-snug line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.brand} • <span className="font-mono">{p.sku}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {p.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {formatPrice(p.price)}/{p.unit}
                    </td>
                    <td className="py-3.5 px-6 font-black text-emerald-700">
                      {formatPrice(p.wholesalePrice)}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        ≥{p.minWholesaleQty} {p.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900">
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 bg-slate-900 text-white shrink-0">
              <h3 className="font-black text-base">
                {editingProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mahsulot to'liq nomi: *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Masalan: Kabel VVG-P ng(A)-LS 3x2.5 GOST"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategoriya:
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({ ...form, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Brend:
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Schneider, CHINT, O'zkabel..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Chakana narx (so'm): *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="12500"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ulgurji (Optom) narx:
                  </label>
                  <input
                    type="number"
                    value={form.wholesalePrice}
                    onChange={(e) =>
                      setForm({ ...form, wholesalePrice: e.target.value })
                    }
                    placeholder="10800"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Min optom miqdori:
                  </label>
                  <input
                    type="number"
                    value={form.minWholesaleQty}
                    onChange={(e) =>
                      setForm({ ...form, minWholesaleQty: e.target.value })
                    }
                    placeholder="100"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    O'lchov birligi:
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  >
                    <option value="metr">Metr</option>
                    <option value="dona">Dona</option>
                    <option value="buxta">Buxta</option>
                    <option value="pachka">Pachka</option>
                    <option value="komplekt">Komplekt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ombordagi soni:
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Badge (Yorliq):
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="Xaridorgir, Optom chegirma"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rasm URL manzili:
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Qisqa tavsif (SEO va qidiruv uchun):
                </label>
                <textarea
                  rows="2"
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  placeholder="Kabel yoki mahsulot haqida 1-2 jumla"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? "Saqlanmoqda..." : "Saqlash"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
