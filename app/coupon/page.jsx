"use client";

import { useState, useEffect, useCallback } from "react";
import TopBar from "./components/TopBar";
import CouponTable from "./components/CouponTable";
import url from "../http/page";   // ✅ central URL file
import { toast } from "sonner";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch(`${url}couponCodes`);
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      } else {
        toast.error(data.message || "Failed to fetch coupons.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server.");
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // ✅ handle Add
  const handleAddCoupon = async (newCouponData) => {
    try {
      const res = await fetch(`${url}couponCodes`, {
        method: "POST",
        body: newCouponData,   // ✅ FormData direct
      });

      const data = await res.json();
      if (data.success) {
        fetchCoupons();
        setEditingCoupon(null);
        toast.success("Coupon added successfully.");
      } else {
        toast.error(data.message || "Failed to add coupon.");
      }
    } catch (error) {
      console.error("Add coupon error:", error);
      toast.error("An error occurred while adding the coupon.");
    }
  };

  // ✅ handle Edit
  const handleEditCoupon = async (id, updatedCouponData) => {
    try {
      const res = await fetch(`${url}couponCodes/${id}`, {
        method: "PUT",
        body: updatedCouponData,  // ✅ FormData direct
      });

      const data = await res.json();
      if (data.success) {
        fetchCoupons();
        setEditingCoupon(null);
        toast.success("Coupon updated successfully.");
      } else {
        toast.error(data.message || "Failed to update coupon.");
      }
    } catch (error) {
      console.error("Edit coupon error:", error);
      toast.error("An error occurred while updating the coupon.");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const res = await fetch(`${url}couponCodes/${couponId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchCoupons();
        toast.success("Coupon deleted successfully.");
      } else {
        toast.error(data.message || "Failed to delete coupon.");
      }
    } catch (error) {
      console.error("Delete coupon error:", error);
      toast.error("An error occurred while deleting the coupon.");
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          couponCount={coupons.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <CouponTable
          coupons={filteredCoupons}
          onAddCoupon={handleAddCoupon}
          onEditCoupon={handleEditCoupon}
          onDeleteCoupon={handleDeleteCoupon}
          onRefresh={fetchCoupons}
          editingCoupon={editingCoupon}
          setEditingCoupon={setEditingCoupon}
        />
      </main>
    </div>
  );
}
