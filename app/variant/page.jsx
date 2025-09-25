"use client"

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import VariantTable from "./components/VariantTable";
import url from '../http/page'; // Assuming url.js is in the same folder
import { usePathname } from 'next/navigation';

export default function Variant() {
  const [variants, setVariants] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVariant, setEditingVariant] = useState(null);
  const pathname = usePathname();

  const fetchVariants = async () => {
    try {
      const response = await fetch(`${url}variants`);
      if (!response.ok) {
        throw new Error("Failed to fetch variants.");
      }
      const data = await response.json();
      setVariants(data.data);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const fetchVariantTypes = async () => {
    try {
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
    fetchVariants();
    fetchVariantTypes();
  }, [pathname]);

  const filteredVariants = variants.filter(variant => {
    const variantTypeName = variant.variantTypeId?.name?.toLowerCase() || '';
    return variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           variantTypeName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
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
          fetchVariants={fetchVariants}
          editingVariant={editingVariant}
          setEditingVariant={setEditingVariant}
        />
      </main>
    </div>
  );
}