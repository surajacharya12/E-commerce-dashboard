"use client";

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import ProductControls from "./components/ProductControls";
import ProductsTable from "./components/ProductTable";
import OrderDetails from "./components/OrderDetails";
import url from "../http/page";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({ status: "", date: "" });

  // ✅ Fetch all data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          prodRes,
          orderRes,
          catRes,
          subRes,
          brandRes,
          vtypeRes,
          varRes,
        ] = await Promise.all([
          fetch(`${url}products`).then((r) => r.json()),
          fetch(`${url}orders`).then((r) => r.json()),
          fetch(`${url}categories`).then((r) => r.json()),
          fetch(`${url}subCategories`).then((r) => r.json()),
          fetch(`${url}brands`).then((r) => r.json()),
          fetch(`${url}variantTypes`).then((r) => r.json()),
          fetch(`${url}variants`).then((r) => r.json()),
        ]);

        setProducts(Array.isArray(prodRes?.data) ? prodRes.data : prodRes || []);
        setOrders(Array.isArray(orderRes?.data) ? orderRes.data : orderRes || []);
        setCategories(Array.isArray(catRes?.data) ? catRes.data : catRes || []);
        setSubcategories(Array.isArray(subRes?.data) ? subRes.data : subRes || []);
        setBrands(Array.isArray(brandRes?.data) ? brandRes.data : brandRes || []);
        setVariantTypes(Array.isArray(vtypeRes?.data) ? vtypeRes.data : vtypeRes || []);
        setVariants(Array.isArray(varRes?.data) ? varRes.data : varRes || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Add product
  const handleAddProduct = async (payload) => {
    try {
      const res = await fetch(`${url}products`, {
        method: "POST",
        body: payload, // Pass FormData directly
      });

      const saved = await res.json();

      if (res.ok) {
        setProducts((prev) => [...prev, saved.data || saved]);
        setEditingProduct(null);
      } else {
        throw new Error(saved.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      throw err;
    }
  };

  // ✅ Edit product
  const handleEditProduct = async (id, payload) => {
    try {
      const res = await fetch(`${url}products/${id}`, {
        method: "PATCH",
        body: payload, // Pass FormData directly
      });

      const updated = await res.json();

      if (res.ok) {
        const updatedProductData = updated.data || updated;

        setProducts((prev) =>
          prev.map((p) =>
            p.id === (updatedProductData.id || updatedProductData._id) ||
            p._id === (updatedProductData.id || updatedProductData._id)
              ? updatedProductData
              : p
          )
        );

        setEditingProduct(null);
      } else {
        throw new Error(updated.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      throw err;
    }
  };

  // ✅ Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${url}products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ✅ Refresh products
  const handleRefreshProducts = async () => {
    try {
      const prodRes = await fetch(`${url}products`).then((r) => r.json());
      setProducts(Array.isArray(prodRes?.data) ? prodRes.data : prodRes || []);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error refreshing products:", err);
    }
  };

  // ✅ Filtered products
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productCounts = {
    all: products.length,
    outOfStock: products.filter((p) => p.quantity === 0).length,
    limitedStock: products.filter((p) => p.quantity > 0 && p.quantity < 10).length,
    otherStock: products.filter((p) => p.quantity >= 10).length,
  };

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main Content Area */}
      <main className="flex-1 p-8 pr-96">
        {/* Increased right padding to prevent content from going under the fixed OrderDetails sidebar */}
        <TopBar
          pageTitle="Admin Dashboard"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
        />

        <ProductControls
          productCounts={productCounts}
          onRefresh={handleRefreshProducts}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          categories={categories}
          subcategories={subcategories}
          brands={brands}
          variantTypes={variantTypes}
          variants={variants}
        />

        <ProductsTable
          products={filteredProducts}
          onDeleteProduct={handleDeleteProduct}
          onEditProduct={handleEditProduct}
          onSetEditingProduct={setEditingProduct}
          categories={categories}
          subcategories={subcategories}
        />
      </main>

      {/* Sidebar - Order Details */}
      <OrderDetails orders={orders} />
    </div>
  );
}
