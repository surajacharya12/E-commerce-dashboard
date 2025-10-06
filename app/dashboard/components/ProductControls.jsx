"use client";

import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileText, RefreshCw, Plus, PackageX, PackageMinus, PackageCheck } from "lucide-react";
import AddProductDialog from "./AddProductDialog";

const ProductControls = ({
  productCounts,
  onRefresh,
  onAddProduct,
  onEditProduct,
  editingProduct,
  setEditingProduct,
  categories,
  subcategories,
  brands,
  variantTypes,
  variants,
}) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-300">My Products</h2>
        <div className="flex items-center gap-8">
          <button onClick={onRefresh} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>

          <AddProductDialog
            onAddProduct={onAddProduct}
            onEditProduct={(id, payload) => onEditProduct(id, payload)}
            initialData={editingProduct}
            categories={categories}
            subcategories={subcategories}
            brands={brands}
            variantTypes={variantTypes}
            variants={variants}
            setEditingProduct={setEditingProduct}
          >
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingProduct(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddProductDialog>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="bg-[#2a2f45] p-6 rounded-xl shadow border border-gray-700">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-300">All Products</h3>
          </div>
          <p className="text-sm text-gray-400 mt-2">{productCounts.all} Products</p>
        </div>

        <div className="bg-[#2a2f45] p-6 rounded-xl shadow border border-gray-700">
          <div className="flex items-center gap-2">
            <PackageX className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-300">Out of Stock</h3>
          </div>
          <p className="text-sm text-gray-400 mt-2">{productCounts.outOfStock} Products</p>
        </div>

        <div className="bg-[#2a2f45] p-6 rounded-xl shadow border border-gray-700">
          <div className="flex items-center gap-2">
            <PackageMinus className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-300">Limited Stock</h3>
          </div>
          <p className="text-sm text-gray-400 mt-2">{productCounts.limitedStock} Products</p>
        </div>

        <div className="bg-[#2a2f45] p-6 rounded-xl shadow border border-gray-700">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-300">Other Stock</h3>
          </div>
          <p className="text-sm text-gray-400 mt-2">{productCounts.otherStock} Products</p>
        </div>
      </div>
    </div>
  );
};

export default ProductControls;