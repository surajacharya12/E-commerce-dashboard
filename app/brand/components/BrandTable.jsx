"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import AddBrandDialog from "./AddBrandDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const BrandTable = ({ brands, subcategories, onAddBrand, onEditBrand, onDeleteBrand, handleRefresh, editingBrand, setEditingBrand }) => {
  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Brand</h2>
        <div className="flex items-center gap-8">
          <button onClick={handleRefresh} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          {/* Add Brand Dialog with "Add New" button as trigger */}
          <AddBrandDialog onAddBrand={onAddBrand} onEditBrand={onEditBrand} initialData={editingBrand} subcategories={subcategories}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingBrand(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddBrandDialog>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Brand Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Sub Category</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="5" className="px-12 py-4 text-center text-gray-400">
                  No brands found.
                </td>
              </tr>
            ) : (
              brands.map(brand => (
                <tr key={brand.id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{brand.name}</td>
                  <td className="px-12 py-4">{subcategories.find(sc => sc.id === brand.subcategoryId)?.name}</td>
                  <td className="px-12 py-4">{brand.date}</td>
                  <td className="px-40 py-4">
                    <AddBrandDialog onAddBrand={onAddBrand} onEditBrand={onEditBrand} initialData={brand} subcategories={subcategories}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setEditingBrand(brand)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddBrandDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => onDeleteBrand(brand.id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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

export default BrandTable;