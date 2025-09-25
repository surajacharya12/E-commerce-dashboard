// app/varianttype/components/VariantTypeTable.jsx
"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import VariantTypeTableDialog from "./VariantTypeTableDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import url from "../../http/page";

const VariantTypeTable = ({ variantTypes, fetchVariantTypes, editingVariant, setEditingVariant }) => {
  const handleAddVariant = async (newVariant) => {
    try {
      // Corrected: Removed the leading slash from the path.
      const response = await fetch(`${url}variantTypes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVariant),
      });
      if (!response.ok) {
        throw new Error("Failed to add variant type.");
      }
      fetchVariantTypes();
      setEditingVariant(null);
    } catch (error) {
      console.error("Error adding variant type:", error);
    }
  };

  const handleEditVariant = async (updatedVariant) => {
    try {
      // Corrected: Removed the leading slash from the path.
      const response = await fetch(`${url}variantTypes/${updatedVariant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: updatedVariant.name, type: updatedVariant.type }),
      });
      if (!response.ok) {
        throw new Error("Failed to update variant type.");
      }
      fetchVariantTypes();
      setEditingVariant(null);
    } catch (error) {
      console.error("Error updating variant type:", error);
    }
  };

  const handleDeleteVariant = async (id) => {
    try {
      // Corrected: Removed the leading slash from the path.
      const response = await fetch(`${url}variantTypes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete variant type.");
      }
      fetchVariantTypes();
    } catch (error) {
      console.error("Error deleting variant type:", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My VariantType</h2>
        <div className="flex items-center gap-8">
          <button onClick={fetchVariantTypes} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <VariantTypeTableDialog onAddVariant={handleAddVariant} onEditVariant={handleEditVariant} initialData={editingVariant}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingVariant(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </VariantTypeTableDialog>
        </div>
      </div>

      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Variant Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Variant Type</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {variantTypes.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="5" className="px-12 py-4 text-center text-gray-400">
                  No variant types found.
                </td>
              </tr>
            ) : (
              variantTypes.map((variant) => (
                <tr key={variant._id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{variant.name}</td>
                  <td className="px-12 py-4">{variant.type}</td>
                  <td className="px-12 py-4">{new Date(variant.createdAt).toLocaleDateString()}</td>
                  <td className="px-40 py-4">
                    <VariantTypeTableDialog onAddVariant={handleAddVariant} onEditVariant={handleEditVariant} initialData={variant}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setEditingVariant(variant)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </VariantTypeTableDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteVariant(variant._id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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

export default VariantTypeTable;