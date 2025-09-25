"use client";

import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import OrderTable from "./components/OrderTable";
import url from "../http/page"; // import backend url

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
      if (Array.isArray(data)) {
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
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customerName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Status" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
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
  );
}
