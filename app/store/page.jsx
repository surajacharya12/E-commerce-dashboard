"use client"

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import StoreTable from "./components/StoreTable";
import url from "../http/page";

export default function Store() {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStore, setEditingStore] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      const formData = new FormData();
      for (const key in newStoreData) {
        // Appends all text fields and the file object (if present)
        formData.append(key, newStoreData[key]);
      }

      await fetch(`${url}stores`, {
        method: 'POST',
        body: formData,
      });
      fetchStores();
    } catch (error) {
      console.error("Error adding store:", error);
    }
  };

  // 🐛 FIX: Corrected logic to ensure text fields (strings) are always appended for PUT requests.
  const handleEditStore = async (updatedStoreData) => {
    try {
      const formData = new FormData();
      
      for (const key in updatedStoreData) {
        // Skip _id as it's used in the URL
        if (key === '_id') continue; 

        const value = updatedStoreData[key];

        // 1. If it's a new file, append the File object
        if (key === 'storeManagerPhoto' && value instanceof File) {
          formData.append(key, value);
        } 
        // 2. If it's the photo field and it's a URL string (old photo), append the string value.
        // 3. For all other fields (name, email, etc.), append the value.
        else if (!(key === 'storeManagerPhoto' && value === null)) {
          // Append all non-null, non-_id, non-file fields (including the old photo URL string)
          formData.append(key, value);
        }
      }

      await fetch(`${url}stores/${updatedStoreData._id}`, {
        method: 'PUT',
        body: formData,
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
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </main>
    </div>
  );
}