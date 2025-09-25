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
        const [prodRes, orderRes, catRes, subRes, brandRes, vtypeRes, varRes] =
          await Promise.all([
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
        setVariantTypes(
          Array.isArray(vtypeRes?.data) ? vtypeRes.data : vtypeRes || []
        );
        setVariants(Array.isArray(varRes?.data) ? varRes.data : varRes || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Add product
  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch(`${url}products`, {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: { "Content-Type": "application/json" },
      });
      const saved = await res.json();
      setProducts((prev) => [...prev, saved.data || saved]);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // ✅ Edit product
  const handleEditProduct = async (updatedProduct) => {
    try {
      await fetch(`${url}products/${updatedProduct.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedProduct),
        headers: { "Content-Type": "application/json" },
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setEditingProduct(null);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // ✅ Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${url}products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          pageTitle="Dashboard"
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
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onSetEditingProduct={setEditingProduct}
          categories={categories}
          subcategories={subcategories}
        />
      </main>
      <OrderDetails orders={orders} />
    </div>
  );
}
