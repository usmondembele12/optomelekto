"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("optomelektro_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Cart load error:", e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("optomelektro_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Cart save error:", e);
      }
    }
  }, [items, mounted]);

  const addToCart = (product, quantity = 1) => {
    const qty = Number(quantity) || 1;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          retailPrice: product.price,
          wholesalePrice: product.wholesalePrice || product.price,
          minWholesaleQty: product.minWholesaleQty || 10,
          unit: product.unit || "dona",
          image: product.image,
          quantity: qty,
        },
      ];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = Math.max(1, Number(newQuantity) || 1);
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate items with dynamic wholesale price applied
  const computedItems = items.map((item) => {
    const isWholesale = item.quantity >= item.minWholesaleQty;
    const effectivePrice = isWholesale ? item.wholesalePrice : item.retailPrice;
    const subtotal = effectivePrice * item.quantity;
    const originalSubtotal = item.retailPrice * item.quantity;
    const savings = originalSubtotal - subtotal;

    return {
      ...item,
      price: effectivePrice,
      isWholesale,
      subtotal,
      savings,
    };
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = computedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalSavings = computedItems.reduce((sum, item) => sum + item.savings, 0);

  return (
    <CartContext.Provider
      value={{
        items: computedItems,
        totalQuantity,
        totalAmount,
        totalSavings,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        mounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
