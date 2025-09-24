"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import ProductControls from "./components/ProductControls";
import ProductsTable from "./components/ProductTable";
import OrderDetails from "./components/OrderDetails";
import { storeApi } from "@/lib/utils";

export default function Dashboard() {
  const [products, setProducts] = useState(storeApi.getAll().products);
  const [orders, setOrders] = useState(storeApi.getAll().orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    date: ""
  });

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    setEditingProduct(null);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleRefreshProducts = () => {
    setProducts([]);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productCounts = {
    all: products.length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    limitedStock: products.filter(p => p.quantity > 0 && p.quantity < 10).length,
    otherStock: products.filter(p => p.quantity >= 10).length,
  };

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
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
        />
        <ProductsTable
          products={filteredProducts}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onSetEditingProduct={setEditingProduct}
        />
      </main>
      {/* Sidebar */}
      <aside className="w-80 bg-[#1f2937] border-l border-gray-700 h-full hidden md:flex flex-col">
        <OrderDetails orders={orders} />
      </aside>
    </div>
  );
}