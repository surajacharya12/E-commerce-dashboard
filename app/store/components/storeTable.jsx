"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AddStoreDialog from "./AddStoreDialog";

const StoreTable = ({ stores, setStores, editingStore, setEditingStore }) => {
  const handleAddStore = (newStore) => {
    setStores([...stores, newStore]);
    setEditingStore(null);
  };

  const handleEditStore = (updatedStore) => {
    setStores(stores.map(store => store.id === updatedStore.id ? updatedStore : store));
    setEditingStore(null);
  };

  const handleDeleteStore = (storeId) => {
    setStores(stores.filter(store => store.id !== storeId));
  };

  const handleRefresh = () => {
    // This will clear all stores, you might want to refetch them from an API instead
    setStores([]);
  };

  return (
    <div>
      {/* Header section with Add and Refresh buttons */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Stores</h2>
        <div className="flex items-center gap-8">
          <button onClick={handleRefresh} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <AddStoreDialog onAddStore={handleAddStore} onEditStore={handleEditStore} initialData={editingStore}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingStore(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddStoreDialog>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Store Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Manager</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Location</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No stores found.
                </td>
              </tr>
            ) : (
              stores.map(store => (
                <tr key={store.id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{store.storeName}</td>
                  <td className="px-12 py-4">{store.storeManagerName}</td>
                  <td className="px-12 py-4">{store.storeLocation}</td>
                  <td className="px-12 py-4">{store.date}</td>
                  <td className="px-12 py-4">
                    <AddStoreDialog onAddStore={handleAddStore} onEditStore={handleEditStore} initialData={store}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setEditingStore(store)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddStoreDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteStore(store.id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                          <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreTable;