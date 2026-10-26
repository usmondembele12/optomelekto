import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJsonFile(filename, fallback = {}) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
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
    console.error(`Error writing ${filename}:`, error.message);
    return false;
  }
}

// Products
export async function getProducts() {
  const data = await readJsonFile("products.json", { products: [] });
  return data.products || [];
}

export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product) {
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
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  await writeJsonFile("products.json", { products: filtered });
  return true;
}

// Categories
export async function getCategories() {
  const data = await readJsonFile("categories.json", { categories: [] });
  return data.categories || [];
}

export async function saveCategory(category) {
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
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  await writeJsonFile("categories.json", { categories: filtered });
  return true;
}

// Orders
export async function getOrders() {
  const data = await readJsonFile("orders.json", { orders: [] });
  return data.orders || [];
}

export async function createOrder(orderData) {
  const orders = await getOrders();
  const orderNumber = 1000 + orders.length + 1;
  const newOrder = {
    id: `OE-${orderNumber}`,
    createdAt: new Date().toISOString(),
    status: "Yangi",
    ...orderData,
  };
  orders.unshift(newOrder);
  await writeJsonFile("orders.json", { orders });
  return newOrder;
}

export async function updateOrderStatus(orderId, status) {
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

// Settings
export async function getSettings() {
  const settings = await readJsonFile("settings.json", {});
  // Fallback to process.env if not set in JSON
  return {
    ...settings,
    telegramBotToken: settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || "",
    telegramChatId: settings.telegramChatId || process.env.TELEGRAM_CHAT_ID || "",
  };
}

export async function updateSettings(newSettings) {
  const current = await readJsonFile("settings.json", {});
  const merged = { ...current, ...newSettings };
  await writeJsonFile("settings.json", merged);
  return merged;
}
