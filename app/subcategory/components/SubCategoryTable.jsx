"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import AddSubCategoryDialog from "./AddSubCategoryDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SubCategoryTable = ({ subcategories, categories, onAddSubCategory, onEditSubCategory, onDeleteSubCategory, handleRefresh, editingSubCategory, setEditingSubCategory }) => {
  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My SubCategory</h2>
        <div className="flex items-center gap-8">
          <button onClick={handleRefresh} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          {/* Add SubCategory Dialog with "Add New" button as trigger */}
          <AddSubCategoryDialog onAddSubCategory={onAddSubCategory} onEditSubCategory={onEditSubCategory} initialData={editingSubCategory} categories={categories}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingSubCategory(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddSubCategoryDialog>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">SubCategory Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Category</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="5" className="px-12 py-4 text-center text-gray-400">
                  No subcategories found.
                </td>
              </tr>
            ) : (
              subcategories.map(sc => (
                <tr key={sc.id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{sc.name}</td>
                  <td className="px-12 py-4">{categories.find(c => c.id === sc.categoryId)?.name}</td>
                  <td className="px-12 py-4">{sc.date}</td>
                  <td className="px-40 py-4">
                    <AddSubCategoryDialog onAddSubCategory={onAddSubCategory} onEditSubCategory={onEditSubCategory} initialData={sc} categories={categories}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => setEditingSubCategory(sc)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddSubCategoryDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => onDeleteSubCategory(sc.id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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

export default SubCategoryTable;