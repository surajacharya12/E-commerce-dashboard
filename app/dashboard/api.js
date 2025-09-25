"use client";

import url from "../http/page";

export const api = {
  async getCategories() {
    const res = await fetch(`${url}categories`);
    return res.json();
  },
  async getSubCategories() {
    const res = await fetch(`${url}subCategories`);
    return res.json();
  },
  async getBrands() {
    const res = await fetch(`${url}brands`);
    return res.json();
  },
  async getVariantTypes() {
    const res = await fetch(`${url}variantTypes`);
    return res.json();
  },
  async getVariants() {
    const res = await fetch(`${url}variants`);
    return res.json();
  },
  async getProducts() {
    const res = await fetch(`${url}products`);
    return res.json();
  },
  async getOrders() {
    const res = await fetch(`${url}orders`);
    return res.json();
  },
};
