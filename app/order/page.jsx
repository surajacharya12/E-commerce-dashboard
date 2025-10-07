"use client";

import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import OrderTable from "./components/OrderTable";
import url from "../http/page"; // import backend url
import ProtectedLayout from "../components/ProtectedLayout";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${url}orders`);
      const data = await res.json();
      console.log("API Response:", data); // 👀 see what backend returns

      // ✅ Normalize: always set an array
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]); // fallback
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // fallback on error
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders();
    setSearchTerm("");
    setStatusFilter("Status");
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${url}orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Use userID.name if populated, otherwise fallback to email or default
    const customerName = order.userID?.name || order.userID?.email || "Unknown Customer";
    // Order number may be present or derived from _id
    const orderNumber = (order.orderNumber || order._id?.slice(-8).toUpperCase() || "").toString();

    // If searchTerm is empty, match everything
    if (!searchTerm || searchTerm.trim() === "") {
      const matchesStatus = statusFilter === "Status" || order.orderStatus === statusFilter.toLowerCase();
      return matchesStatus;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const matchesCustomer = customerName.toLowerCase().includes(lowerSearch);
    const matchesOrderNumber = orderNumber.toLowerCase().includes(lowerSearch);
    const matchesStatus = statusFilter === "Status" || order.orderStatus === statusFilter.toLowerCase();

    return (matchesCustomer || matchesOrderNumber) && matchesStatus;
  });

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
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
    </ProtectedLayout>
  );
}
