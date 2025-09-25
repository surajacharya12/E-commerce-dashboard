"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AddStoreDialog from "./AddStoreDialog";
import url from "../../http/page";

const StoreTable = ({ stores, setStores, editingStore, setEditingStore, fetchStores, onAddStore, onEditStore }) => {
  const handleDeleteStore = async (storeId) => {
    try {
      await fetch(`${url}stores/${storeId}`, { method: "DELETE" });
      fetchStores();
    } catch (err) {
      console.error("Error deleting store:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Stores</h2>
        <div className="flex items-center gap-8">
          <button onClick={fetchStores} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <AddStoreDialog onAddStore={onAddStore} onEditStore={onEditStore} initialData={editingStore}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingStore(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddStoreDialog>
        </div>
      </div>

      {/* Table */}
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
                <td colSpan="6" className="text-center py-6 text-gray-400">No stores found.</td>
              </tr>
            ) : (
              stores.map(store => (
                <tr key={store._id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{store.storeName}</td>
                  <td className="px-12 py-4">{store.storeManagerName}</td>
                  <td className="px-12 py-4">{store.storeLocation}</td>
                  <td className="px-12 py-4">{new Date(store.createdAt).toLocaleDateString()}</td>
                  <td className="px-12 py-4">
                    <AddStoreDialog onAddStore={onAddStore} onEditStore={onEditStore} initialData={store}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setEditingStore(store)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddStoreDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteStore(store._id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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