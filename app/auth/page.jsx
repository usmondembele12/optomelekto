"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Zap,
  User,
  Phone,
  Lock,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Truck,
  BadgePercent,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const ACTIVITY_OPTIONS = [
  { id: "Usta / Elektrik", label: "⚡ Usta / Elektrik" },
  { id: "Do'kon / Savdogar", label: "🏪 Do'kon / Savdogar" },
  { id: "Qurilish kompaniyasi", label: "🏗️ Qurilish kompaniyasi" },
  { id: "Jismoniy shaxs", label: "👤 Jismoniy shaxs (Uy uchun)" },
];

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { register, login } = useAuth();

  const [activeTab, setActiveTab] = useState("register"); // 'register' | 'login'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [activityType, setActivityType] = useState("Usta / Elektrik");

  // Format phone number
  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith("+998")) {
      val = "+998 ";
    }
    setPhone(val);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Iltimos, ism va familiyangizni to'liq kiriting");
      return;
    }

    if (phone.replace(/[^\d]/g, "").length < 12) {
      setError("Telefon raqamingizni to'liq kiriting (masalan: +998 90 123 45 67)");
      return;
    }

    if (!password || password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        phone: phone.trim(),
        password,
        activityType,
      });

      setSuccessMsg("Muvaffaqiyatli ro'yxatdan o'tdingiz! Asosiy sahifaga o'tilmoqda...");
      setTimeout(() => {
        router.push(redirectPath);
        router.refresh();
      }, 700);
    } catch (err) {
      if (err.isExisting) {
        setError(err.message);
        setActiveTab("login");
      } else {
        setError(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (phone.replace(/[^\d]/g, "").length < 12) {
      setError("Telefon raqamingizni to'liq kiriting");
      return;
    }

    if (!password) {
      setError("Parolingizni kiriting");
      return;
    }

    setLoading(true);
    try {
      await login(phone.trim(), password);
      setSuccessMsg("Xush kelibsiz! Asosiy sahifaga o'tilmoqda...");
      setTimeout(() => {
        router.push(redirectPath);
        router.refresh();
      }, 700);
    } catch (err) {
      setError(err.message || "Telefon raqam yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/20 mb-4 animate-bounce-slow">
          <Zap className="w-9 h-9 fill-current" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          OPTOM <span className="text-amber-400">ELEKTRO</span>
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Toshkentda 1-qo'l ulgurji elektrotexnika va kabel markazi
        </p>

        {/* Welcome Tag */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Saytni ko'rishdan oldin ro'yxatdan o'ting</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8">
          <p className="text-xs text-slate-400 text-center mb-5">
            Sayt mahsulotlari va ulgurji narxlarini ko'rish uchun avval ro'yxatdan o'ting yoki hisobingizga kiring.
          </p>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950/70 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setError("");
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Ro'yxatdan o'tish
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tizimga kirish
            </button>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Alert Success */}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= REGISTER FORM ================= */}
          {activeTab === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ism va Familiyangiz *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan, Alisher Karimov"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Telefon raqamingiz *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-mono"
                  />
                </div>
              </div>

              {/* Activity Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Faoliyatingiz turi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIVITY_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActivityType(item.id)}
                      className={`px-3 py-2 text-xs rounded-xl border text-left font-medium transition ${
                        activityType === item.id
                          ? "bg-amber-500/15 border-amber-500/60 text-amber-300"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Parol (kamida 4 ta belgi) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Qayta kirish uchun parol"
                    className="w-full pl-10 pr-10 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Yuklanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Ro'yxatdan o'tish va Saytga kirish</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Telefon raqamingiz *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Parolingiz *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    className="w-full pl-10 pr-10 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Tekshirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirish va Davom etish</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Benefits bar */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] text-slate-400">
          <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
            <BadgePercent className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span>1-qo'l ulgurji narxlar</span>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
            <Truck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span>Toshkentda tezkor yetkazish</span>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span>Kafolatlangan sifat</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400 text-sm">
          Yuklanmoqda...
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}

