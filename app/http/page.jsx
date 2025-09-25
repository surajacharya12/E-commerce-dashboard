const url = "http://localhost:3001/";
export default url;

// src/lib/utils/storeApi.js
const API_URL = "http://localhost:3001/";

export const storeApi = {
  getAll: async () => {
    try {
      const [
        productsRes,
        ordersRes,
        categoriesRes,
        subcategoriesRes,
        brandsRes,
        variantTypesRes,
        variantsRes,
      ] = await Promise.all([
        fetch(`${API_URL}products`).then((res) => res.json()),
        fetch(`${API_URL}orders`).then((res) => res.json()),
        fetch(`${API_URL}categories`).then((res) => res.json()),
        fetch(`${API_URL}subCategories`).then((res) => res.json()),
        fetch(`${API_URL}brands`).then((res) => res.json()),
        fetch(`${API_URL}variantTypes`).then((res) => res.json()),
        fetch(`${API_URL}variants`).then((res) => res.json()),
      ]);

      return {
        products: productsRes.data || [],
        orders: ordersRes.data || [],
        categories: categoriesRes.data || [],
        subcategories: subcategoriesRes.data || [],
        brands: brandsRes.data || [],
        variantTypes: variantTypesRes.data || [],
        variants: variantsRes.data || [],
      };
    } catch (error) {
      console.error("Failed to fetch all data:", error);
      return {
        products: [],
        orders: [],
        categories: [],
        subcategories: [],
        brands: [],
        variantTypes: [],
        variants: [],
      };
    }
  },
};