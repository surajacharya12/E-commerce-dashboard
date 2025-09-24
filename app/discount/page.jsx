"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import DiscountTable from "./components/DiscountTable";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDiscount, setEditingDiscount] = useState(null);

  const filteredDiscounts = discounts.filter(discount =>
    discount.discountName.toLowerCase().includes(searchTerm.toLowerCase())
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
          setDiscounts={setDiscounts}
          editingDiscount={editingDiscount}
          setEditingDiscount={setEditingDiscount}
        />
      </main>
    </div>
  );
}