"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import StoreTable from "./components/StoreTable";

export default function Store() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStore, setEditingStore] = useState(null);

  const filteredStores = stores.filter(store =>
    store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.storeManagerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <StoreTable
          stores={filteredStores}
          setStores={setStores}
          editingStore={editingStore}
          setEditingStore={setEditingStore}
        />
      </main>
    </div>
  );
}