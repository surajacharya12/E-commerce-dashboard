"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import BrandTable from "./components/BrandTable";
import { storeApi } from "@/lib/utils";

export default function Brand() {
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState(storeApi.getAll().subcategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);

  const handleAddBrand = (newBrand) => {
    setBrands([...brands, { ...newBrand, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    setEditingBrand(null);
  };

  const handleEditBrand = (updatedBrand) => {
    setBrands(brands.map(brand => brand.id === updatedBrand.id ? updatedBrand : brand));
    setEditingBrand(null);
  };

  const handleDeleteBrand = (id) => {
    setBrands(brands.filter(brand => brand.id !== id));
  };

  const handleRefresh = () => {
    setBrands([]);
    setEditingBrand(null);
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategories.find(sc => sc.id === brand.subcategoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          pageTitle="Brand"
          itemCount={brands.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <BrandTable
          brands={filteredBrands}
          subcategories={subcategories}
          onAddBrand={handleAddBrand}
          onEditBrand={handleEditBrand}
          onDeleteBrand={handleDeleteBrand}
          handleRefresh={handleRefresh}
          editingBrand={editingBrand}
          setEditingBrand={setEditingBrand}
        />
      </main>
    </div>
  );
}