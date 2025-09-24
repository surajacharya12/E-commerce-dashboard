"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import VariantTable from "./components/VariantTable";
import { storeApi } from "@/lib/utils";

export default function Variant() {
  const [variants, setVariants] = useState([]);
  const [variantTypes, setVariantTypes] = useState(storeApi.getAll().variantTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVariant, setEditingVariant] = useState(null);

  const handleAddVariant = (newVariant) => {
    setVariants([...variants, { ...newVariant, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    setEditingVariant(null);
  };

  const handleEditVariant = (updatedVariant) => {
    setVariants(variants.map(variant => variant.id === updatedVariant.id ? updatedVariant : variant));
    setEditingVariant(null);
  };

  const handleDeleteVariant = (id) => {
    setVariants(variants.filter(variant => variant.id !== id));
  };
  
  const handleRefresh = () => {
    setVariants([]);
    setEditingVariant(null);
  };

  const filteredVariants = variants.filter(variant =>
    variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variantTypes.find(vt => vt.id === variant.type)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          pageTitle="Variant"
          itemCount={variants.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <VariantTable
          variants={filteredVariants}
          variantTypes={variantTypes}
          onAddVariant={handleAddVariant}
          onEditVariant={handleEditVariant}
          onDeleteVariant={handleDeleteVariant}
          handleRefresh={handleRefresh}
          editingVariant={editingVariant}
          setEditingVariant={setEditingVariant}
        />
      </main>
    </div>
  );
}