"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import AddVariantDialog from "./AddVariantDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import url from '../../http/page';

const VariantTable = ({ variants, variantTypes, fetchVariants, editingVariant, setEditingVariant }) => {
  const handleAddVariant = async (newVariant) => {
    try {
      const response = await fetch(`${url}variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVariant),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add variant.");
      }
      fetchVariants();
      setEditingVariant(null);
    } catch (error) {
      console.error("Error adding variant:", error);
      alert(error.message);
    }
  };

  const handleEditVariant = async (id, updatedVariant) => {
    try {
      const response = await fetch(`${url}variants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVariant),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update variant.");
      }
      fetchVariants();
      setEditingVariant(null);
    } catch (error) {
      console.error("Error updating variant:", error);
      alert(error.message);
    }
  };

  const handleDeleteVariant = async (id) => {
    try {
      const response = await fetch(`${url}variants/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete variant.");
      }
      fetchVariants();
    } catch (error) {
      console.error("Error deleting variant:", error);
      alert(error.message);
    }
  };

  const getVariantTypeName = (variant) => {
    return variant?.variantTypeId?.name || "N/A";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Variant</h2>
        <div className="flex items-center gap-8">
          <button onClick={fetchVariants} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <AddVariantDialog onAddVariant={handleAddVariant} onEditVariant={handleEditVariant} initialData={editingVariant} variantTypes={variantTypes}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingVariant(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddVariantDialog>
        </div>
      </div>

      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Variant</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Variant Type</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="5" className="px-12 py-4 text-center text-gray-400">
                  No variants found.
                </td>
              </tr>
            ) : (
              variants.map(variant => (
                <tr key={variant._id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{variant.name}</td>
                  <td className="px-12 py-4">{getVariantTypeName(variant)}</td>
                  <td className="px-12 py-4">{new Date(variant.createdAt).toLocaleDateString()}</td>
                  <td className="px-40 py-4">
                    <AddVariantDialog onAddVariant={handleAddVariant} onEditVariant={handleEditVariant} initialData={variant} variantTypes={variantTypes}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setEditingVariant(variant)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddVariantDialog>
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

export default VariantTable;