"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import SizeTableDialog from "./SizeTableDialog"; // New dialog component
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import url from "../../http/page"; // Assuming your http configuration remains the same

const SizeTable = ({ sizes, fetchSizes, editingSize, setEditingSize }) => {
  const handleAddSize = async (newSize) => {
    try {
      const response = await fetch(`${url}sizes`, { // API endpoint for adding sizes
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSize),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add size.");
      }
      fetchSizes();
      setEditingSize(null);
    } catch (error) {
      console.error("Error adding size:", error);
      alert(error.message);
    }
  };

  const handleEditSize = async (updatedSize) => {
    try {
      const response = await fetch(`${url}sizes/${updatedSize.id}`, { // API endpoint for updating sizes
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: updatedSize.name, description: updatedSize.description }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update size.");
      }
      fetchSizes();
      setEditingSize(null);
    } catch (error) {
      console.error("Error updating size:", error);
      alert(error.message);
    }
  };

  const handleDeleteSize = async (id) => {
    try {
      const response = await fetch(`${url}sizes/${id}`, { // API endpoint for deleting sizes
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete size.");
      }
      fetchSizes();
    } catch (error) {
      console.error("Error deleting size:", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Sizes</h2>
        <div className="flex items-center gap-8">
          <button onClick={fetchSizes} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <SizeTableDialog onAddSize={handleAddSize} onEditSize={handleEditSize} initialData={editingSize}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingSize(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </SizeTableDialog>
        </div>
      </div>

      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Size Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Description</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {sizes.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="5" className="px-12 py-4 text-center text-gray-400">
                  No sizes found.
                </td>
              </tr>
            ) : (
              sizes.map((size) => (
                <tr key={size._id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{size.name}</td>
                  <td className="px-12 py-4">{size.description || 'N/A'}</td>
                  <td className="px-12 py-4">{new Date(size.createdAt).toLocaleDateString()}</td>
                  <td className="px-40 py-4">
                    <SizeTableDialog onAddSize={handleAddSize} onEditSize={handleEditSize} initialData={size}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setEditingSize(size)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </SizeTableDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteSize(size._id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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

export default SizeTable;