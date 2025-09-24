"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import CategoryTable from "./components/CategoryTable";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, { ...newCategory, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    setEditingCategory(null);
  };

  const handleEditCategory = (updatedCategory) => {
    setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleRefresh = () => {
    setCategories([]);
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          pageTitle="Category"
          itemCount={categories.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <CategoryTable
          categories={filteredCategories}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          handleRefresh={handleRefresh}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
        />
      </main>
    </div>
  );
}