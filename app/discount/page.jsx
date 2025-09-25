"use client"

import { useState, useEffect, useCallback } from "react";
import TopBar from "./components/TopBar";
import DiscountTable from "./components/DiscountTable";
import url from "../http/page";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDiscount, setEditingDiscount] = useState(null);

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await fetch(`${url}discounts`);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        setDiscounts(data.data);
      } else {
        console.error("API returned an unexpected structure:", data);
        setDiscounts([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setDiscounts([]);
    }
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleAddDiscount = async (newDiscountData) => {
    try {
      const formData = new FormData();
      for (const key in newDiscountData) {
        formData.append(key, newDiscountData[key]);
      }

      const res = await fetch(`${url}discounts`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        fetchDiscounts();
        return { success: true, message: "Discount added successfully." };
      } else {
        return { success: false, message: data.message || "Failed to add discount." };
      }
    } catch (error) {
      console.error("Add discount error:", error);
      return { success: false, message: "An error occurred while adding the discount." };
    }
  };

  const handleEditDiscount = async (updatedDiscountData) => {
    try {
      const formData = new FormData();
      for (const key in updatedDiscountData) {
        if (key === "_id") continue;
        formData.append(key, updatedDiscountData[key]);
      }

      const res = await fetch(`${url}discounts/${updatedDiscountData._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        fetchDiscounts();
        setEditingDiscount(null);
        return { success: true, message: "Discount updated successfully." };
      } else {
        return { success: false, message: data.message || "Failed to update discount." };
      }
    } catch (error) {
      console.error("Edit discount error:", error);
      return { success: false, message: "An error occurred while updating the discount." };
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    try {
      const res = await fetch(`${url}discounts/${discountId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchDiscounts();
        return { success: true, message: "Discount deleted successfully." };
      } else {
        return { success: false, message: data.message || "Failed to delete discount." };
      }
    } catch (error) {
      console.error("Delete discount error:", error);
      return { success: false, message: "An error occurred while deleting the discount." };
    }
  };

  const filteredDiscounts = discounts.filter((discount) =>
    discount.discountName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          discountCount={discounts.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <DiscountTable
          discounts={filteredDiscounts}
          onAddDiscount={handleAddDiscount}
          onEditDiscount={handleEditDiscount}
          onDeleteDiscount={handleDeleteDiscount}
          onRefresh={fetchDiscounts}
          editingDiscount={editingDiscount}
          setEditingDiscount={setEditingDiscount}
        />
      </main>
    </div>
  );
}