"use client"

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import VariantTypeTable from "./components/VariantTypeTable";
import url from '../http/page';

export default function VariantType() {
  const [variantTypes, setVariantTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVariant, setEditingVariant] = useState(null);

  const fetchVariantTypes = async () => {
    try {
      // The fetch URL is corrected to work with your backend's route.
      const response = await fetch(`${url}variantTypes`);
      if (!response.ok) {
        throw new Error("Failed to fetch variant types.");
      }
      const data = await response.json();
      setVariantTypes(data.data);
    } catch (error) {
      console.error("Error fetching variant types:", error);
    }
  };

  useEffect(() => {
    fetchVariantTypes();
  }, []);

  const filteredVariants = variantTypes.filter(variant =>
    variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variant.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          itemCount={variantTypes.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          pageTitle="Variant Type"
        />
        <VariantTypeTable
          variantTypes={filteredVariants}
          fetchVariantTypes={fetchVariantTypes}
          editingVariant={editingVariant}
          setEditingVariant={setEditingVariant}
        />
      </main>
    </div>
  );
}