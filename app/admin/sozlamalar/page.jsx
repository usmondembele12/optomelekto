"use client";

import { useState, useEffect } from "react";
import {
  Send,
  Save,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Phone,
  MapPin,
  Lock,
  Key,
  Database,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "",
    phone: "",
    phoneSecondary: "",
    email: "",
    address: "",
    workingHours: "",
    telegramBotToken: "",
    telegramChatId: "",
    adminPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [hasMongo, setHasMongo] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
          setHasMongo(Boolean(data.hasMongo));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert("Xatolik: " + data.error);
      }
    } catch (e) {
      alert("Xatolik: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/telegram/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: settings.telegramBotToken,
          chatId: settings.telegramChatId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult({
          type: "success",
          message:
            "Ajoyib! Telegramingizga test xabari yetib bordi. Bot to'liq ishlamoqda!",
        });
      } else {
        setTestResult({
          type: "error",
          message:
            data.error ||
            "Xatolik: Bot token yoki Chat ID noto'g'ri, yoki botga /start bosilmagan.",
        });
      }
    } catch (e) {
      setTestResult({
        type: "error",
        message: "Tarmoq xatosi: " + e.message,
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Sozlamalar yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Telegram Bot va Tizim Sozlamalari
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Yangi buyurtmalarni Telegramga qabul qilish va do'kon parametrlarini boshqarish
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Barcha sozlamalar muvaffaqiyatli saqlandi!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Telegram Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Telegram Bot Integratsiyasi
              </h3>
              <p className="text-xs text-slate-500">
                Haridor saytdan buyurtma berganda ushbu bot orqali telefoningizga xabar keladi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Telegram Bot Token:
              </label>
              <input
                type="text"
                placeholder="Masalan: 7123456789:AAHk..."
                value={settings.telegramBotToken}
                onChange={(e) =>
                  setSettings({ ...settings, telegramBotToken: e.target.value })
                }
                className="w-full px-3.5 py-2.5 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                @BotFather tomonidan berilgan bot tokeni
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Telegram Chat ID (yoki Guruh ID):
              </label>
              <input
                type="text"
                placeholder="Masalan: 987654321 yoki -100..."
                value={settings.telegramChatId}
                onChange={(e) =>
                  setSettings({ ...settings, telegramChatId: e.target.value })
                }
                className="w-full px-3.5 py-2.5 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Xabarlar borishi kerak bo'lgan shaxsiy profilingiz yoki guruh ID raqami
              </span>
            </div>
          </div>

          {/* Test connection button & feedback */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              disabled={testing || !settings.telegramBotToken || !settings.telegramChatId}
              onClick={handleTestTelegram}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testing ? "Test xabar yuborilmoqda..." : "Telegram Botni Tekshirish (Test Xabar)"}</span>
            </button>

            {testResult && (
              <div
                className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 ${
                  testResult.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {testResult.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Instructions Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-600">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Telegram Botni qanday sozlash kerak? (Qo'llanma)</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
              <li>
                Telegramda <b>@BotFather</b> ga kiring va <code>/newbot</code> deb yozing. Bot nomi va username bering.
              </li>
              <li>
                BotFather sizga bergan uzun <b>API Token</b>ni nusxalab, yuqoridagi "Telegram Bot Token" qatoriga qo'ying.
              </li>
              <li>
                <b>MUHIM:</b> O'zingiz yaratgan yangi botingizga kiring va <b>/start</b> tugmasini bosing! (Aks holda bot sizga xabar yuborolmaydi).
              </li>
              <li>
                Telegramda <b>@userinfobot</b> ga kiring, u sizning <b>Id:</b> raqamingizni chiqarib beradi. O'sha raqamni "Telegram Chat ID" ga qo'ying.
              </li>
              <li>
                Pastdagi <b>"Saqlash"</b> tugmasini bosing va <b>"Telegram Botni Tekshirish"</b> tugmasini bosib tekshirib ko'ring!
              </li>
            </ol>
          </div>
        </div>

        {/* Store Contacts Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Do'kon Rekvizitlari va Manzili
              </h3>
              <p className="text-xs text-slate-500">
                Sayt sarlavhasi, foter va kontaktlar sahifasida ko'rinadigan ma'lumotlar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Do'kon nomi:
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({ ...settings, storeName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Asosiy telefon raqam:
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Qo'shimcha telefon:
              </label>
              <input
                type="text"
                value={settings.phoneSecondary}
                onChange={(e) =>
                  setSettings({ ...settings, phoneSecondary: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ish vaqti:
              </label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) =>
                  setSettings({ ...settings, workingHours: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Do'kon va ombor manzili (Toshkent):
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Security / Password */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Admin Panel Xavfsizligi
              </h3>
              <p className="text-xs text-slate-500">
                Admin panelga kirish paroli (Boshlang'ich parol: <code>admin</code>)
              </p>
            </div>
          </div>

          <div className="max-w-md text-xs">
            <label className="block font-bold text-slate-700 mb-1">
              Admin paroli:
            </label>
            <input
              type="text"
              value={settings.adminPassword}
              onChange={(e) =>
                setSettings({ ...settings, adminPassword: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
            />
          </div>
        </div>

        {/* Backend Database Status */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Backend Ma'lumotlar Bazasi (MongoDB)
              </h3>
              <p className="text-xs text-slate-500">
                Tovarlar, buyurtmalar va sozlamalarni bulutli bazada doimiy saqlash
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                hasMongo
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  hasMongo ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                }`}
              />
              {hasMongo
                ? "MongoDB Bulutli Bazasi Ulangan (Faol)"
                : "Ichki Standart Baza (Lokal/Serverless)"}
            </span>
          </div>

          {!hasMongo && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-800">
                💡 Vercel-da tovarlarni 100% doimiy saqlab qolish uchun MongoDB ulash:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>
                  <b>mongodb.com</b> (MongoDB Atlas) ga kirib, bepul klaster oching (5 daqiqa).
                </li>
                <li>
                  Ulanish manzilini (<code>mongodb+srv://...</code>) nusxalang.
                </li>
                <li>
                  Vercel profilingizda: <b>Settings &gt; Environment Variables</b> bo'limiga o'tib, <code>MONGODB_URI</code> nomi bilan o'sha ulanish manzilini qo'shing.
                </li>
                <li>
                  Sayt barcha mahsulotlar va buyurtmalarni avtomatik tarzda MongoDB-ga ko'chiradi va doimiy saqlaydi!
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl flex items-center gap-2 shadow-xl shadow-amber-500/20 transition disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saqlanmoqda..." : "Sozlamalarni Saqlash"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
