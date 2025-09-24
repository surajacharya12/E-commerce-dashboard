"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import CouponTable from "./components/CouponTable";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);

  const filteredCoupons = coupons.filter(coupon =>
    coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          couponCount={coupons.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <CouponTable
          coupons={filteredCoupons}
          setCoupons={setCoupons}
          editingCoupon={editingCoupon}
          setEditingCoupon={setEditingCoupon}
        />
      </main>
    </div>
  );
}