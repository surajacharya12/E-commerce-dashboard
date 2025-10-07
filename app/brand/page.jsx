"use client";

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import BrandTable from "./components/BrandTable";
import { toast } from "react-hot-toast";
import url from "../http/page";
import { Tag } from "lucide-react";

import ProtectedLayout from "../components/ProtectedLayout";
export default function Brand() {
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch brands + subcategories
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [brandsResponse, subcategoriesResponse] = await Promise.all([
        fetch(`${url}brands`),          // ✅ fixed (no extra slash)
        fetch(`${url}subCategories`)    // ✅ fixed (no extra slash)
      ]);

      const brandsData = await brandsResponse.json();
      const subcategoriesData = await subcategoriesResponse.json();

      if (brandsData.success) setBrands(brandsData.data);
      else throw new Error(brandsData.message);

      if (subcategoriesData.success) setSubcategories(subcategoriesData.data);
      else throw new Error(subcategoriesData.message);

    } catch (error) {
      setError(error.message);
      toast.error(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Add Brand
  const handleAddBrand = async (newBrand) => {
    try {
      const response = await fetch(`${url}brands`, {   // ✅ fixed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBrand),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchData();
        setEditingBrand(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Error adding brand: ${error.message}`);
    }
  };

  // Edit Brand
  const handleEditBrand = async (updatedBrand) => {
    try {
      const response = await fetch(`${url}brands/${updatedBrand._id}`, {  // ✅ fixed
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBrand),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchData();
        setEditingBrand(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Error editing brand: ${error.message}`);
    }
  };

  // Delete Brand
  const handleDeleteBrand = async (id) => {
    try {
      const response = await fetch(`${url}brands/${id}`, { method: "DELETE" }); // ✅ fixed
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Error deleting brand: ${error.message}`);
    }
  };

  // Search filter
  const filteredBrands = brands.filter((brand) => {
    const subcategoryName =
      subcategories.find((sc) => sc._id === brand.subcategoryId?._id)?.name || "";
    return (
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
        <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
          <TopBar
            pageTitle="Brand"
            itemCount={brands.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            icon={Tag}
          />
          <BrandTable
            brands={filteredBrands}
            subcategories={subcategories}
            onAddBrand={handleAddBrand}
            onEditBrand={handleEditBrand}
            onDeleteBrand={handleDeleteBrand}
            handleRefresh={fetchData}
            editingBrand={editingBrand}
            setEditingBrand={setEditingBrand}
            loading={loading}
            error={error}
          />
        </main>
      </div>
    </ProtectedLayout>
  );
}
