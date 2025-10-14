"use client";

import { Edit, Trash2, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AddProductDialog from "./AddProductDialog";

const ProductsTable = ({
  products = [],
  onDeleteProduct,
  onEditProduct,
  onSetEditingProduct,
  categories = [],
  subcategories = [],
  brands = [],
  // --- START: MODIFIED CODE ---
  colors = [], // New prop for colors
  sizes = [],  // New prop for sizes
  // --- END: MODIFIED CODE ---
}) => {
  const handleEdit = (product) => {
    onSetEditingProduct(product);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              {/* --- START: MODIFIED CODE --- */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Colors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Sizes
              </th>
              {/* --- END: MODIFIED CODE --- */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12"> {/* Updated colspan */}
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-white">No products</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Get started by creating a new product.
                  </p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 relative group">
                        {product.images && product.images.length > 0 ? (
                          <>
                            <img
                              src={product.images[0].url || product.images[0]}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-600 cursor-pointer transition-transform duration-200 group-hover:scale-105"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            {/* Hover Preview */}
                            <div className="absolute left-16 top-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              <div className="bg-gray-900 border border-gray-600 rounded-lg p-2 shadow-2xl">
                                <img
                                  src={product.images[0].url || product.images[0]}
                                  alt={product.name}
                                  className="h-32 w-32 rounded-lg object-cover"
                                />
                                <div className="mt-2 text-xs text-gray-300 text-center max-w-32 truncate">
                                  {product.name}
                                </div>
                                {product.images.length > 1 && (
                                  <div className="text-xs text-blue-400 text-center">
                                    +{product.images.length - 1} more
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        ) : null}
                        <div
                          className={`h-12 w-12 rounded-lg bg-gray-600 flex items-center justify-center ${product.images && product.images.length > 0 ? 'hidden' : ''}`}
                        >
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          ID: {product._id.slice(-6)}
                        </div>
                        {product.images && product.images.length > 1 && (
                          <div className="text-xs text-blue-400">
                            +{product.images.length - 1} more images
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {product.proCategoryId?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {product.proSubCategoryId?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      Rs. {product.price}
                    </div>
                    {product.offerPrice && (
                      <div className="text-sm text-green-400">
                        Offer: Rs. {product.offerPrice}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(product.stock || 0) > 10
                      ? 'bg-green-100 text-green-800'
                      : (product.stock || 0) > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {product.stock || 0} units
                    </span>
                  </td>
                  {/* --- START: MODIFIED CODE --- */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {product.colors && product.colors.length > 0 ? (
                        product.colors.map((color) => (
                          <span
                            key={color._id}
                            className="w-4 h-4 rounded-full border border-gray-500"
                            style={{ backgroundColor: color.hexCode }}
                            title={color.name}
                          ></span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.map((size) => (
                          <span
                            key={size._id}
                            className="text-xs text-white bg-gray-600 px-2 py-1 rounded-full"
                          >
                            {size.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                  {/* --- END: MODIFIED CODE --- */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-white">
                        {product.rating?.averageRating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        ({product.rating?.totalReviews || 0})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <AddProductDialog
                        onAddProduct={() => { }} // Not used when editing
                        onEditProduct={onEditProduct}
                        initialData={product}
                        categories={categories}
                        subcategories={subcategories}
                        brands={brands}
                        // --- START: MODIFIED CODE ---
                        colors={colors} // Pass colors to AddProductDialog
                        sizes={sizes}   // Pass sizes to AddProductDialog
                        // --- END: MODIFIED CODE ---
                        setEditingProduct={onSetEditingProduct}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </AddProductDialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteProduct(product._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default ProductsTable;