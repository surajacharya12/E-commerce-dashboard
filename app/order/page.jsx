"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import OrderTable from "./components/OrderTable";

const mockOrders = [
  {
    id: 1,
    customerName: "John Doe",
    orderAmount: 150.00,
    payment: "Paid",
    status: "Processing",
    date: "2025-09-24",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    orderAmount: 75.50,
    payment: "Pending",
    status: "Shipped",
    date: "2025-09-23",
  },
  {
    id: 3,
    customerName: "Robert Brown",
    orderAmount: 300.25,
    payment: "Paid",
    status: "Delivered",
    date: "2025-09-22",
  },
  {
    id: 4,
    customerName: "Emily White",
    orderAmount: 25.00,
    payment: "Cancelled",
    status: "Cancelled",
    date: "2025-09-21",
  },
];

export default function Order() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");

  const handleRefresh = () => {
    // In a real application, you would fetch fresh data from an API here
    setOrders(mockOrders);
    setSearchTerm("");
    setStatusFilter("Status");
  };
  
  const handleDelete = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Status" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          orderCount={filteredOrders.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <OrderTable
          orders={filteredOrders}
          handleRefresh={handleRefresh}
          handleDelete={handleDelete}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </main>
    </div>
  );
}