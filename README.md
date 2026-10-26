# ⚡ OPTOM ELEKTRO TOSHKENT — E-Commerce & Ulgurji Savdo Tizimi

Toshkent shahrida kabel, avtomatika, rozetkalar, transformatorlar va LED yoritish jihozlari savdosi bilan shug'ullanuvchi do'kon uchun to'liq optimizatsiyalangan, zamonaviy **Next.js 16 (App Router)** internet-do'koni, **Admin Panel** va **Telegram Bot** integratsiyasi.

---

## 🌟 Asosiy Xususiyatlar va Imkoniyatlar

### 1. 🔍 To'liq SEO (Search Engine Optimization)
- **Yuqori pozitsiyalar uchun meta teglar**: Toshkent bozoriga xos kalit so'zlar (*"optom elektro toshkent"*, *"kabel optom narxda"*, *"vvg kabel toshkent"*, *"schneider avtomat optom"* va b.).
- **OpenGraph & Twitter Cards**: Ijtimoiy tarmoqlar va Telegramda havola ulashilganda chiroyli karta shaklida ko'rinadi.
- **Dinamik XML Sitemap (`/sitemap.xml`)**: Google qidiruv robotlari uchun barcha sahifalar, kategoriyalar va mahsulotlar avtomatik ro'yxatga olinadi.
- **Dinamik Robots.txt (`/robots.txt`)**: Admin panel va API larni himoyalaydi, qidiruv tizimlariga to'g'ri indekslash yo'nalishini beradi.
- **Schema.org JSON-LD Structured Data**:
  - `LocalBusiness` / `Store` (Toshkent manzili, GPS koordinatalar, telefon, ish vaqti).
  - `Product` schema (narx, valyuta UZS, availability, SKU, brend) — Google qidiruv natijalarida mahsulot narxi va zaxirasi boyitilgan shaklda chiqadi.

### 2. 🤖 Telegram Bot Integratsiyasi
- Haridor sayt orqali tovar buyurtma qilganda (savatdan yoki 1 bosishda tezkor xarid orqali):
  - ⚡ **Buyurtma ID (#OE-XXXX)**
  - 👤 **Mijoz ismi va to'liq telefon raqami**
  - 📍 **Toshkent bo'yicha tuman va yetkazish manzili**
  - 💳 **To'lov turi** (Naqd / Click / Payme / Yuridik shaxs hisob-fakturasi)
  - 📦 **Har bir tovar nomi, o'lchov birligi (metr/dona), narxi va jami summasi**
  - 💰 **Jami buyurtma summasi va ulgurji chegirma miqdori**
  - ⏰ **Vaqt va mijoz izohi**
- **Admin paneldan to'g'ridan-to'g'ri sozlash**: Bot token va Chat ID ni `.env` orqali yoki saytning o'zidagi admin paneldan kiritish mumkin.
- **"Telegram botni tekshirish" tugmasi**: Bot to'g'ri ulanganini darhol test xabari orqali tekshirib olish imkoniyati.

### 3. 🔐 To'liq Funksional Admin Panel (`/admin`)
- **Dashboard (Boshqaruv markazi)**: Jami buyurtmalar, yangi buyurtmalar soni, jami savdo aylanmasi (so'mda), mahsulotlar soni va oxirgi buyurtmalar jadvali.
- **Buyurtmalar boshqaruvi (`/admin/buyurtmalar`)**:
  - Barcha buyurtmalarni ko'rish, holat bo'yicha saralash (*Yangi*, *Qabul qilingan*, *Yetkazilmoqda*, *Yakunlangan*, *Bekor qilingan*).
  - Buyurtma holatini bitta bosishda o'zgartirish.
  - Telegramga qayta yuborish tugmasi.
- **Mahsulotlar boshqaruvi (`/admin/mahsulotlar`)**:
  - Yangi mahsulot qo'shish (CRUD).
  - Chakana narx va Ulgurji (Optom) narx belgilash.
  - Minimal optom miqdori (masalan: 100 metr kabel, 12 dona avtomat).
  - O'lchov birliklari (*metr*, *dona*, *buxta*, *pachka*).
  - Tahrirlash va o'chirish.
- **Kategoriyalar boshqaruvi (`/admin/kategoriyalar`)**: Bo'limlarni boshqarish.
- **Sozlamalar (`/admin/sozlamalar`)**: Telegram bot token, chat ID, telefonlar, manzil va admin paroli.

### 4. 🛒 Savatcha va Xarid Tajribasi
- **Avtomatik Ulgurji Chegirma**: Haridor tovar miqdorini ulgurji limitga yetkazganda narx avtomatik pasayadi va tejov miqdori yashil yorliq bilan ko'rsatiladi.
- **1 Bosishda Tezkor Xarid**: Ro'yxatdan o'tmasdan faqat ism va telefon kiritish orqali tezkor buyurtma berish.
- **Moslashuvchan Dizayn**: Mobil telefonlar, planshetlar va kompyuterlar uchun 100% moslashgan interfeys (Tailwind CSS).

---

## 🚀 Loyihani Ishga Tushirish

### 1. Loyihani dev rejimida ishga tushirish:
```bash
npm run dev
```
Sayt manzili: [http://localhost:3000](http://localhost:3000)

### 2. Production build qilish va ishga tushirish:
```bash
npm run build
npm start
```

---

## 🔑 Admin Panelga Kirish

- **Admin manzil**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Boshlang'ich parol**: `admin`
*(Parolni `/admin/sozlamalar` sahifasidan istalgan vaqtda o'zgartirishingiz mumkin)*

---

## 🤖 Telegram Botni Sozlash Qo'llanmasi (5 daqiqada)

1. Telegramda **[@BotFather](https://t.me/BotFather)** botiga kiring.
2. `/newbot` buyrug'ini yuboring, botingizga nom va username bering (masalan: `OptomElektroBot`).
3. BotFather bergan **HTTP API Token**ni nusxalab oling (masalan: `7123456789:AAHk...`).
4. **MUHIM:** Yangi yaratgan botingizga kiring va pastdagi **`/start`** tugmasini bosing!
5. O'zingizning Chat ID raqamingizni olish uchun Telegramda **[@userinfobot](https://t.me/userinfobot)** ga kiring, u sizga `Id: 123456789` raqamini ko'rsatadi.
6. Saytingizdagi [http://localhost:3000/admin/sozlamalar](http://localhost:3000/admin/sozlamalar) sahifasiga kiring:
   - **Telegram Bot Token** qatoriga tokenni qo'ying.
   - **Telegram Chat ID** qatoriga raqamingizni qo'ying.
   - **"Sozlamalarni saqlash"** tugmasini bosing.
   - **"Telegram Botni Tekshirish (Test Xabar)"** tugmasini bosib tekshirib oling!

*Agar buyurtmalar shaxsiy chatga emas, do'kon xodimlari bo'lgan Telegram guruhga borishi kerak bo'lsa:*
- Botni guruhga a'zo qilib qo'shing.
- Guruh ID raqamini (odatda `-100...` bilan boshlanadi) Chat ID qatoriga yozing.

---

## 📁 Loyiha Tuzilmasi

```
optomelektro/
├── app/
│   ├── layout.js              # Global SEO meta, OpenGraph, JSON-LD Schema
│   ├── page.jsx               # Toshkent ulgurji savdo bosh sahifasi (Hero, FAQ)
│   ├── katalog/page.jsx       # Mahsulotlar katalogi, qidiruv va filtrlash
│   ├── mahsulot/[slug]/       # Mahsulot batafsil sahifasi + Product Schema
│   ├── savat/page.jsx         # Savatcha va rasmiylashtirish (Telegramga yuborish)
│   ├── buyurtma-muvaffaqiyatli/ # Buyurtma tasdiqlandi sahifasi
│   ├── aloqa/page.jsx         # Toshkent Sergeli do'koni manzili va xarita
│   ├── biz-haqimizda/page.jsx # Kompaniya haqida ishonch sahifasi
│   ├── sitemap.js             # Dinamik XML sitemap
│   ├── robots.js              # Dinamik robots.txt
│   ├── admin/                 # Boshqaruv paneli (Dashboard, Buyurtmalar, Tovar)
│   └── api/                   # REST API yo'nalishlari
├── components/                # Reusable UI komponentlar
├── context/                   # Savat konteksti (LocalStorage, wholesale hisob-kitob)
├── data/                      # JSON ma'lumotlar bazasi (products, orders, settings)
└── lib/                       # DB helpers, Telegram notification engine
```
