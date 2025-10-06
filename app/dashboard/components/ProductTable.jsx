"use client";

import { Edit, Trash2 } from "lucide-react";
import AddProductDialog from "./AddProductDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ProductsTable = ({
  products = [],
  onDeleteProduct,
  onEditProduct,
  onSetEditingProduct,
  categories = [],
  subcategories = [],
}) => {
  // Use product.proCategoryId._id and product.proSubCategoryId._id for lookup
  const getCategoryName = (product) => categories.find((c) => (c._id) === product.proCategoryId?._id)?.name;
  const getSubCategoryName = (product) => subcategories.find((s) => (s._id) === product.proSubCategoryId?._id)?.name;


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
            products.map((product) => (
              <tr key={product._id} className="border-t border-gray-700">
                <td className="px-6 py-4">{product.name}</td>
                {/* Access populated category/subcategory names */}
                <td className="px-6 py-4">{product.proCategoryId?.name || 'N/A'}</td>
                <td className="px-6 py-4">{product.proSubCategoryId?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-white">${product.price}</td>
                <td className="px-6 py-4">
                  <AddProductDialog
                    onAddProduct={() => {}} // Not used when editing
                    onEditProduct={(id, payload) => onEditProduct(id, payload)}
                    initialData={product}
                    categories={categories}
                    subcategories={subcategories}
                    // Pass all other necessary props for the dialog's dropdowns
                    brands={[]} // You need to pass real brand data here
                    variantTypes={[]} // You need to pass real variant type data here
                    variants={[]} // You need to pass real variant data here
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
                  <button onClick={() => onDeleteProduct(product._id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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