"use client";

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import ProductControls from "./components/ProductControls";
import ProductsTable from "./components/ProductTable";
import OrderDetails from "./components/OrderDetails";
import { toast } from "sonner";
import url from "../http/page";
import ProtectedLayout from "../components/ProtectedLayout";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({ status: "", date: "" });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchCategories(),
        fetchSubCategories(),
        fetchBrands(),
        fetchVariantTypes(),
        fetchVariants(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${url}products`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      } else {
        toast.error(result.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error("Failed to fetch products: " + error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${url}orders`);
      const result = await response.json();
      setOrders(Array.isArray(result?.data) ? result.data : result || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}categories`);
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch(`${url}subCategories`);
      const result = await response.json();
      if (result.success) {
        setSubcategories(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${url}brands`);
      const result = await response.json();
      if (result.success) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const fetchVariantTypes = async () => {
    try {
      const response = await fetch(`${url}variantTypes`);
      const result = await response.json();
      if (result.success) {
        setVariantTypes(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch variant types:", error);
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await fetch(`${url}variants`);
      const result = await response.json();
      if (result.success) {
        setVariants(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      const response = await fetch(`${url}products`, {
        method: "POST",
        body: formData, // FormData is passed directly
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Product created successfully");
        fetchProducts();
        setEditingProduct(null);
      } else {
        toast.error(result.message || "Failed to add product");
      }
    } catch (error) {
      console.error('Add product error:', error);
      toast.error("An error occurred: " + error.message);
    }
  };

  const handleEditProduct = async (id, formData) => {
    try {
      const response = await fetch(`${url}products/${id}`, {
        method: "PUT",
        body: formData, // FormData is passed directly
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Product updated successfully");
        fetchProducts();
        setEditingProduct(null);
      } else {
        toast.error(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error('Edit product error:', error);
      toast.error("An error occurred: " + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${url}products/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("An error occurred: " + error.message);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productCounts = {
    all: products.length,
    outOfStock: products.filter((p) => (p.stock || p.quantity || 0) === 0).length,
    limitedStock: products.filter((p) => (p.stock || p.quantity || 0) > 0 && (p.stock || p.quantity || 0) < 10).length,
    otherStock: products.filter((p) => (p.stock || p.quantity || 0) >= 10).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
        {/* Main Content Area */}
        <main className="flex-1 p-8 pr-96">
          <TopBar
            pageTitle="Admin Dashboard"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
          />

          <ProductControls
            productCounts={productCounts}
            onRefresh={fetchProducts}
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
            brands={brands}
            variantTypes={variantTypes}
            variants={variants}
          />
        </main>

        {/* Sidebar - Order Details */}
        <OrderDetails orders={orders} />
      </div>
    </ProtectedLayout>
  );
}