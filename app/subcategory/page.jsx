"use client";

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import SubCategoryTable from "./components/SubCategoryTable";
import url from "../http/page";
import { Layers } from "lucide-react";

import ProtectedLayout from "../components/ProtectedLayout";
const API_URL = url + "subCategories";

export default function SubCategory() {
  const [subCategories, setSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const fetchSubCategories = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch sub-categories.");
      }
      const data = await response.json();
      setSubCategories(data.data);
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Updated to accept FormData
  const handleAddSubCategory = async (formData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        // DO NOT set 'Content-Type': 'application/json' when sending FormData
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add sub-category.");
      }
      fetchSubCategories();
      // Logic to close the dialog after successful addition
      // Note: You may need a state in parent to force close the dialog
      // For now, we rely on a full page refresh/re-fetch.
    } catch (error) {
      console.error("Error adding sub-category:", error.message);
    }
  };

  // Updated to accept FormData
  const handleEditSubCategory = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        // DO NOT set 'Content-Type': 'application/json' when sending FormData
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit sub-category.");
      }
      fetchSubCategories();
      setEditingSubCategory(null); // Clear editing state and close dialog
    } catch (error) {
      console.error("Error editing sub-category:", error.message);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete sub-category.");
      }
      fetchSubCategories();
    } catch (error) {
      console.error("Error deleting sub-category:", error.message);
    }
  };

  const handleRefresh = () => {
    fetchSubCategories();
  };

  const filteredSubCategories = subCategories.filter(subCategory =>
    subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subCategory.categoryId?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
        <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
          <TopBar
            pageTitle="Sub-category"
            itemCount={subCategories.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            icon={Layers}
          />
          <SubCategoryTable
            subCategories={filteredSubCategories}
            onAddSubCategory={handleAddSubCategory}
            onEditSubCategory={handleEditSubCategory}
            onDeleteSubCategory={handleDeleteSubCategory}
            handleRefresh={handleRefresh}
            editingSubCategory={editingSubCategory}
            setEditingSubCategory={setEditingSubCategory}
          />
        </main>
      </div>
    </ProtectedLayout>
  );
}






