import mongoose from "mongoose";

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, default: "Boshqa" },
    brand: { type: String, default: "Optom Elektro" },
    sku: { type: String, default: "" },
    price: { type: Number, required: true },
    wholesalePrice: { type: Number, required: true },
    minWholesaleQty: { type: Number, default: 10 },
    unit: { type: String, default: "dona" },
    stock: { type: Number, default: 100 },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    image: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    specs: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

// Category Schema
const CategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "Zap" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

// Order Schema
const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, default: "Toshkent shahri" },
    address: { type: String, default: "" },
    paymentMethod: { type: String, default: "Naqd yetkazilganda" },
    status: { type: String, default: "Yangi" },
    notes: { type: String, default: "" },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        originalPrice: Number,
        isWholesale: Boolean,
        unit: String,
        quantity: Number,
        subtotal: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Settings Schema
const SettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Optom Elektro Toshkent" },
    tagline: { type: String, default: "Toshkentda elektrotexnika va kabellar ulgurji markazi" },
    phone: { type: String, default: "+998 71 200 45 45" },
    phoneSecondary: { type: String, default: "+998 90 123 45 67" },
    telegramManager: { type: String, default: "@optomelektro_admin" },
    email: { type: String, default: "info@optomelektro.uz" },
    city: { type: String, default: "Toshkent shahri" },
    address: {
      type: String,
      default: "Toshkent sh., Sergeli tumani, Yangi Sergeli ko'chasi, 12-uy (Elektr bozori, 4-blok)",
    },
    workingHours: {
      type: String,
      default: "Dush - Shan: 08:30 - 18:30 | Yak: 09:00 - 15:00",
    },
    telegramBotToken: {
      type: String,
      default: "8954426665:AAHJc94iLVpctZ0mPJfcSWqkCg4ejMSidl8",
    },
    telegramChatId: { type: String, default: "8038275900" },
    telegramNotificationsEnabled: { type: Boolean, default: true },
    adminPassword: { type: String, default: "admin" },
    minWholesaleOrderSum: { type: Number, default: 500000 },
    freeDeliveryThreshold: { type: Number, default: 1000000 },
  },
  { timestamps: true }
);

export const ProductModel =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export const CategoryModel =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export const SettingsModel =
  mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
