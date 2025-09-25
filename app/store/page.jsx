"use client"

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import StoreTable from "./components/StoreTable";
import url from "../http/page";

export default function Store() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch(`${url}stores`);
      const data = await res.json();
      if (data.success) {
        setStores(data.data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleAddStore = async (newStoreData) => {
    try {
      await fetch(`${url}stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStoreData),
      });
      fetchStores();
    } catch (error) {
      console.error("Error adding store:", error);
    }
  };

  const handleEditStore = async (updatedStoreData) => {
    try {
      await fetch(`${url}stores/${updatedStoreData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStoreData),
      });
      fetchStores();
    } catch (error) {
      console.error("Error editing store:", error);
    }
  };

  const search = searchTerm.toLowerCase();
  const filteredStores = stores.filter(store => {
    const name = store.storeName?.toLowerCase() || "";
    const manager = store.storeManagerName?.toLowerCase() || "";
    return name.includes(search) || manager.includes(search);
  });

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          total={filteredStores.length}
        />
        <StoreTable
          stores={filteredStores}
          setStores={setStores}
          editingStore={editingStore}
          setEditingStore={setEditingStore}
          fetchStores={fetchStores}
          onAddStore={handleAddStore}
          onEditStore={handleEditStore}
        />
      </main>
    </div>
  );
}