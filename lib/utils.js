import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Simple client-side data store backed by localStorage
const STORAGE_KEY = "cecom_store_v1";

function loadStore() {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    const parsed = JSON.parse(raw);
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      subcategories: Array.isArray(parsed.subcategories) ? parsed.subcategories : [],
      variantTypes: Array.isArray(parsed.variantTypes) ? parsed.variantTypes : [],
      variants: Array.isArray(parsed.variants) ? parsed.variants : [],
      brands: Array.isArray(parsed.brands) ? parsed.brands : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
    };
  } catch {
    return defaultStore();
  }
}

function defaultStore() {
  return { categories: [], subcategories: [], variantTypes: [], variants: [], brands: [], products: [] };
}

function saveStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export const storeApi = {
  getAll() {
    return loadStore();
  },
  addCategory(name) {
    const s = loadStore();
    const item = { id: generateId("cat"), name };
    s.categories.push(item);
    saveStore(s);
    return item;
  },
  addSubcategory(categoryId, name) {
    const s = loadStore();
    const item = { id: generateId("sub"), categoryId, name };
    s.subcategories.push(item);
    saveStore(s);
    return item;
  },
  addVariantType(name) {
    const s = loadStore();
    const item = { id: generateId("vtype"), name };
    s.variantTypes.push(item);
    saveStore(s);
    return item;
  },
  addVariant(variantTypeId, name) {
    const s = loadStore();
    const item = { id: generateId("var"), variantTypeId, name };
    s.variants.push(item);
    saveStore(s);
    return item;
  },
  addBrand(subcategoryId, name) {
    const s = loadStore();
    const item = { id: generateId("brand"), subcategoryId, name };
    s.brands.push(item);
    saveStore(s);
    return item;
  },
  addProduct(product) {
    const s = loadStore();
    const item = { id: generateId("prod"), ...product };
    s.products.push(item);
    saveStore(s);
    return item;
  },
}
