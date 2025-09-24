"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import VariantTypeTable from "./components/VariantTypeTable";

export default function VariantType() {
  const [variantTypes, setVariantTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVariant, setEditingVariant] = useState(null);

  const filteredVariants = variantTypes.filter(variant =>
    variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variant.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          itemCount={variantTypes.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          pageTitle="Variant Type"
        />
        <VariantTypeTable
          variantTypes={filteredVariants}
          setVariantTypes={setVariantTypes}
          editingVariant={editingVariant}
          setEditingVariant={setEditingVariant}
        />
      </main>
    </div>
  );
}