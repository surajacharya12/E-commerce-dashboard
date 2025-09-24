"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import SubCategoryTable from "./components/SubCategoryTable";
import { storeApi } from "@/lib/utils";

export default function SubCategory() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState(storeApi.getAll().categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const handleAddSubCategory = (newSubCategory) => {
    setSubcategories([...subcategories, { ...newSubCategory, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    setEditingSubCategory(null);
  };

  const handleEditSubCategory = (updatedSubCategory) => {
    setSubcategories(subcategories.map(sc => sc.id === updatedSubCategory.id ? updatedSubCategory : sc));
    setEditingSubCategory(null);
  };

  const handleDeleteSubCategory = (id) => {
    setSubcategories(subcategories.filter(sc => sc.id !== id));
  };

  const handleRefresh = () => {
    setSubcategories([]);
    setEditingSubCategory(null);
  };

  const filteredSubCategories = subcategories.filter(sc =>
    sc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categories.find(c => c.id === sc.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          pageTitle="SubCategory"
          itemCount={subcategories.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <SubCategoryTable
          subcategories={filteredSubCategories}
          categories={categories}
          onAddSubCategory={handleAddSubCategory}
          onEditSubCategory={handleEditSubCategory}
          onDeleteSubCategory={handleDeleteSubCategory}
          handleRefresh={handleRefresh}
          editingSubCategory={editingSubCategory}
          setEditingSubCategory={setEditingSubCategory}
        />
      </main>
    </div>
  );
}