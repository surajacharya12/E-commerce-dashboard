"use client";

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import CategoryTable from "./components/CategoryTable";
import url from "../http/page";
import { Grid3X3 } from "lucide-react";

const API_URL = url + "categories";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch categories.");
      }
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (name, imageFile) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('img', imageFile);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add category.");
      }
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error.message);
    }
  };

  const handleEditCategory = async (id, name, imageFile) => {
    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('img', imageFile);
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit category.");
      }
      fetchCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error("Error editing category:", error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category.");
      }
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  const handleRefresh = () => {
    fetchCategories();
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          pageTitle="Category"
          itemCount={categories.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          icon={Grid3X3}
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