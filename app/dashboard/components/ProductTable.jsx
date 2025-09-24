"use client"

import { Edit, Trash2 } from "lucide-react";
import AddProductDialog from "./AddProductDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { storeApi } from "@/lib/utils";

const ProductsTable = ({ products, onDeleteProduct, onSetEditingProduct }) => {
  const data = storeApi.getAll();

  const getCategoryName = (categoryId) => data.categories.find(c => c.id === categoryId)?.name;
  const getSubCategoryName = (subcategoryId) => data.subcategories.find(sc => sc.id === subcategoryId)?.name;

  return (
    <div className="bg-[#2a2f45] rounded-xl shadow overflow-hidden border border-gray-700">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#1e2235]">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Product Name</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Category</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Sub Category</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Price</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Edit</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr className="border-t border-gray-700">
              <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                No products found.
              </td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.id} className="border-t border-gray-700">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{getCategoryName(product.categoryId)}</td>
                <td className="px-6 py-4">{getSubCategoryName(product.subcategoryId)}</td>
                <td className="px-6 py-4 text-white">${product.price}</td>
                <td className="px-6 py-4">
                  <AddProductDialog
                    onAddProduct={() => {}} // No-op for editing dialog
                    onEditProduct={onSetEditingProduct}
                    initialData={product}
                    categories={data.categories}
                    subcategories={data.subcategories}
                    brands={data.brands}
                    variantTypes={data.variantTypes}
                    variants={data.variants}
                    setEditingProduct={onSetEditingProduct}
                  >
                    <AlertDialogTrigger asChild>
                      <button onClick={() => onSetEditingProduct(product)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                  </AddProductDialog>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onDeleteProduct(product.id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;