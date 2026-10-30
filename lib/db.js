import fs from "fs/promises";
import path from "path";
import os from "os";
import { connectToDatabase } from "./mongodb";
import { ProductModel, CategoryModel, OrderModel, SettingsModel, UserModel } from "./models";

const DATA_DIR = path.join(process.cwd(), "data");
const TMP_DIR = path.join(os.tmpdir(), "optomelektro_data");

const DEFAULT_BOT_TOKEN = "8954426665:AAHJc94iLVpctZ0mPJfcSWqkCg4ejMSidl8";
const DEFAULT_CHAT_ID = "8038275900";

// --- Fallback JSON Helpers ---
async function readJsonFile(filename, fallback = {}) {
  try {
    const tmpPath = path.join(TMP_DIR, filename);
    const content = await fs.readFile(tmpPath, "utf-8");
    return JSON.parse(content);
  } catch {}

  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return fallback;
  }
}

async function writeJsonFile(filename, data) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, filename);
    const tempPath = `${filePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tempPath, filePath);
    return true;
  } catch (error) {
    try {
      await fs.mkdir(TMP_DIR, { recursive: true });
      const tmpPath = path.join(TMP_DIR, filename);
      await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch {
      return false;
    }
  }
}

// --- Auto-seed Mongo from JSON if empty ---
let isSeeded = false;
async function seedMongoIfEmpty() {
  if (isSeeded) return;
  try {
    const pCount = await ProductModel.countDocuments();
    if (pCount === 0) {
      const pData = await readJsonFile("products.json", { products: [] });
      if (pData.products?.length > 0) {
        await ProductModel.insertMany(pData.products);
      }
    }

    const cCount = await CategoryModel.countDocuments();
    if (cCount === 0) {
      const cData = await readJsonFile("categories.json", { categories: [] });
      if (cData.categories?.length > 0) {
        await CategoryModel.insertMany(cData.categories);
      }
    }

    const sCount = await SettingsModel.countDocuments();
    if (sCount === 0) {
      const sData = await readJsonFile("settings.json", {});
      await SettingsModel.create({
        ...sData,
        telegramBotToken: DEFAULT_BOT_TOKEN,
        telegramChatId: DEFAULT_CHAT_ID,
      });
    }

    isSeeded = true;
  } catch (err) {
    console.error("Auto-seed MongoDB error:", err.message);
  }
}

// ==========================================
// PRODUCTS
// ==========================================
export async function getProducts() {
  const conn = await connectToDatabase();
  if (conn) {
    await seedMongoIfEmpty();
    const docs = await ProductModel.find().lean();
    return docs.map((d) => ({ ...d, _id: undefined }));
  }

  const data = await readJsonFile("products.json", { products: [] });
  return data.products || [];
}

export async function getProductBySlug(slug) {
  const conn = await connectToDatabase();
  if (conn) {
    await seedMongoIfEmpty();
    const doc = await ProductModel.findOne({ slug }).lean();
    return doc ? { ...doc, _id: undefined } : null;
  }

  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id) {
  const conn = await connectToDatabase();
  if (conn) {
    await seedMongoIfEmpty();
    const doc = await ProductModel.findOne({ id }).lean();
    return doc ? { ...doc, _id: undefined } : null;
  }

  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product) {
  const conn = await connectToDatabase();
  if (conn) {
    await seedMongoIfEmpty();
    await ProductModel.findOneAndUpdate({ id: product.id }, product, {
      upsert: true,
      new: true,
    });
    return product;
  }

  const products = await getProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = { ...products[index], ...product };
  } else {
    products.unshift(product);
  }
  await writeJsonFile("products.json", { products });
  return product;
}

export async function deleteProduct(id) {
  const conn = await connectToDatabase();
  if (conn) {
    await ProductModel.deleteOne({ id });
    return true;
  }

  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  await writeJsonFile("products.json", { products: filtered });
  return true;
}

// ==========================================
// CATEGORIES
// ==========================================
export async function getCategories() {
  const conn = await connectToDatabase();
  if (conn) {
    await seedMongoIfEmpty();
    const docs = await CategoryModel.find().lean();
    return docs.map((d) => ({ ...d, _id: undefined }));
  }

  const data = await readJsonFile("categories.json", { categories: [] });
  return data.categories || [];
}

export async function saveCategory(category) {
  const conn = await connectToDatabase();
  if (conn) {
    await CategoryModel.findOneAndUpdate({ id: category.id }, category, {
      upsert: true,
      new: true,
    });
    return category;
  }

  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    categories[index] = { ...categories[index], ...category };
  } else {
    categories.push(category);
  }
  await writeJsonFile("categories.json", { categories });
  return category;
}

export async function deleteCategory(id) {
  const conn = await connectToDatabase();
  if (conn) {
    await CategoryModel.deleteOne({ id });
    return true;
  }

  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  await writeJsonFile("categories.json", { categories: filtered });
  return true;
}

// ==========================================
// ORDERS
// ==========================================
export async function getOrders() {
  const conn = await connectToDatabase();
  if (conn) {
    const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, _id: undefined }));
  }

  const data = await readJsonFile("orders.json", { orders: [] });
  return data.orders || [];
}

export async function createOrder(orderData) {
  const conn = await connectToDatabase();
  const orders = await getOrders();
  const orderNumber = 1000 + orders.length + 1;
  const newOrder = {
    id: `OE-${orderNumber}`,
    createdAt: new Date().toISOString(),
    status: "Yangi",
    ...orderData,
  };

  if (conn) {
    await OrderModel.create(newOrder);
    return newOrder;
  }

  orders.unshift(newOrder);
  await writeJsonFile("orders.json", { orders });
  return newOrder;
}

export async function updateOrderStatus(orderId, status) {
  const conn = await connectToDatabase();
  if (conn) {
    const doc = await OrderModel.findOneAndUpdate(
      { id: orderId },
      { status, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();
    return doc ? { ...doc, _id: undefined } : null;
  }

  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index >= 0) {
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    await writeJsonFile("orders.json", { orders });
    return orders[index];
  }
  return null;
}

// ==========================================
// SETTINGS
// ==========================================
export async function getSettings() {
  const conn = await connectToDatabase();
  if (conn) {
    await seedMongoIfEmpty();
    const doc = await SettingsModel.findOne().lean();
    if (doc) {
      return {
        ...doc,
        _id: undefined,
        telegramBotToken:
          process.env.TELEGRAM_BOT_TOKEN ||
          doc.telegramBotToken ||
          DEFAULT_BOT_TOKEN,
        telegramChatId:
          process.env.TELEGRAM_CHAT_ID ||
          doc.telegramChatId ||
          DEFAULT_CHAT_ID,
      };
    }
  }

  const settings = await readJsonFile("settings.json", {});
  return {
    ...settings,
    telegramBotToken:
      process.env.TELEGRAM_BOT_TOKEN ||
      settings.telegramBotToken ||
      DEFAULT_BOT_TOKEN,
    telegramChatId:
      process.env.TELEGRAM_CHAT_ID ||
      settings.telegramChatId ||
      DEFAULT_CHAT_ID,
  };
}

export async function updateSettings(newSettings) {
  const conn = await connectToDatabase();
  if (conn) {
    const updated = await SettingsModel.findOneAndUpdate({}, newSettings, {
      upsert: true,
      new: true,
    }).lean();
    return { ...updated, _id: undefined };
  }

  const current = await readJsonFile("settings.json", {});
  const merged = { ...current, ...newSettings };
  await writeJsonFile("settings.json", merged);
  return merged;
}

// ==========================================
// USERS / CUSTOMERS
// ==========================================
export function normalizePhone(phone) {
  if (!phone) return "";
  // Keep only digits and '+'
  const cleaned = phone.replace(/[^\d+]/g, "");
  // If starts with 998... without +, add +
  if (cleaned.startsWith("998")) return `+${cleaned}`;
  // If starts with 90, 91, 93, etc (9 digits), prepend +998
  if (/^\d{9}$/.test(cleaned)) return `+998${cleaned}`;
  return cleaned;
}

export async function getUsers() {
  const conn = await connectToDatabase();
  if (conn) {
    const docs = await UserModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, _id: undefined }));
  }

  const data = await readJsonFile("users.json", { users: [] });
  return data.users || [];
}

export async function findUserByPhone(phone) {
  const norm = normalizePhone(phone);
  const conn = await connectToDatabase();
  if (conn) {
    const doc = await UserModel.findOne({
      $or: [{ phone: norm }, { phone: phone }],
    }).lean();
    return doc ? { ...doc, _id: undefined } : null;
  }

  const users = await getUsers();
  return users.find(
    (u) => normalizePhone(u.phone) === norm || u.phone === phone
  ) || null;
}

export async function createUser(userData) {
  const conn = await connectToDatabase();
  const normPhone = normalizePhone(userData.phone);
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newUser = {
    id: userId,
    fullName: userData.fullName.trim(),
    phone: normPhone,
    password: userData.password,
    activityType: userData.activityType || "Jismoniy shaxs",
    city: userData.city || "Toshkent shahri",
    address: userData.address || "",
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  if (conn) {
    await UserModel.create(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  const users = await getUsers();
  users.unshift(newUser);
  await writeJsonFile("users.json", { users });
  const { password, ...safeUser } = newUser;
  return safeUser;
}

export async function authenticateUser(phone, password) {
  const user = await findUserByPhone(phone);
  if (!user) return null;
  if (user.password !== password) return null;

  const { password: _, ...safeUser } = user;
  return safeUser;
}

export async function updateUser(idOrPhone, updateData) {
  const norm = normalizePhone(idOrPhone);
  const conn = await connectToDatabase();

  const allowedUpdates = {};
  if (updateData.fullName) allowedUpdates.fullName = updateData.fullName.trim();
  if (updateData.activityType) allowedUpdates.activityType = updateData.activityType;
  if (updateData.city) allowedUpdates.city = updateData.city;
  if (updateData.address !== undefined) allowedUpdates.address = updateData.address;

  if (conn) {
    const updated = await UserModel.findOneAndUpdate(
      { $or: [{ id: idOrPhone }, { phone: norm }, { phone: idOrPhone }] },
      { $set: allowedUpdates },
      { new: true }
    ).lean();
    if (updated) {
      const { password, ...safeUser } = updated;
      return safeUser;
    }
    return null;
  }

  const users = await getUsers();
  const index = users.findIndex(
    (u) => u.id === idOrPhone || normalizePhone(u.phone) === norm || u.phone === idOrPhone
  );

  if (index >= 0) {
    users[index] = { ...users[index], ...allowedUpdates };
    await writeJsonFile("users.json", { users });
    const { password, ...safeUser } = users[index];
    return safeUser;
  }

  return null;
}

export async function getUserOrders(phone) {
  const norm = normalizePhone(phone);
  const allOrders = await getOrders();
  return allOrders.filter(
    (o) => normalizePhone(o.phone) === norm || o.phone === phone
  );
}
