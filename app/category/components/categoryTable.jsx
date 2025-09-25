"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import AddCategoryDialog from "./AddCategoryDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const CategoryTable = ({ categories, onAddCategory, onEditCategory, onDeleteCategory, handleRefresh, editingCategory, setEditingCategory }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Category</h2>
        <div className="flex items-center gap-8">
          <button onClick={handleRefresh} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <AddCategoryDialog onAddCategory={onAddCategory} onEditCategory={onEditCategory} initialData={editingCategory}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingCategory(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddCategoryDialog>
        </div>
      </div>

      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Category Image</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Category Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="5" className="px-12 py-4 text-center text-gray-400">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map(category => (
                <tr key={category._id} className="border-t border-gray-700">
                  <td className="px-12 py-4">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="h-10 w-10 object-cover rounded-lg" />
                    ) : (
                      <div className="h-10 w-10 bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-12 py-4">{category.name}</td>
                  <td className="px-12 py-4">{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td className="px-40 py-4">
                    <AddCategoryDialog onAddCategory={onAddCategory} onEditCategory={onEditCategory} initialData={category}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setEditingCategory(category)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddCategoryDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => onDeleteCategory(category._id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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

export default CategoryTable;