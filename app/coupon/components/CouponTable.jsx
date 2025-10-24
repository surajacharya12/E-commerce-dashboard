"use client";

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import AddCouponDialog from "./AddCouponDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const CouponTable = ({ coupons, onAddCoupon, onEditCoupon, onDeleteCoupon, onRefresh, editingCoupon, setEditingCoupon }) => {
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
  };

  const handleDelete = async (couponId) => {
    await onDeleteCoupon(couponId);
  };

  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Coupons</h2>
        <div className="flex items-center gap-8">
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700"
          >
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <AddCouponDialog
            onAddCoupon={onAddCoupon}
            onEditCoupon={onEditCoupon}
            initialData={editingCoupon}
            setEditingCoupon={setEditingCoupon}
          >
            <AlertDialogTrigger asChild>
              <button
                onClick={() => setEditingCoupon(null)}
                className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow"
              >
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddCouponDialog>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1500px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-8 py-6 text-sm font-semibold text-gray-300">Coupon Code</th>
              <th className="px-8 py-3 text-sm font-semibold text-gray-300">Status</th>
              <th className="px-8 py-3 text-sm font-semibold text-gray-300">Type</th>
              <th className="px-8 py-3 text-sm font-semibold text-gray-300">Amount</th>
              <th className="px-8 py-3 text-sm font-semibold text-gray-300">Applicable To</th>
              <th className="px-8 py-3 text-sm font-semibold text-gray-300">Min. Purchase</th>
              <th className="px-8 py-3 text-sm font-semibold text-gray-300">Expires</th>
              <th className="px-8 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="9" className="px-12 py-4 text-center text-gray-400">
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => {
                const getApplicableTo = () => {
                  if (coupon.applicableProduct?.name) {
                    return (
                      <div className="flex flex-col">
                        <span className="text-xs text-blue-400 font-medium">Product:</span>
                        <span className="text-sm text-gray-300 truncate max-w-[120px]" title={coupon.applicableProduct.name}>
                          {coupon.applicableProduct.name}
                        </span>
                      </div>
                    );
                  } else if (coupon.applicableCategory?.name) {
                    return (
                      <div className="flex flex-col">
                        <span className="text-xs text-green-400 font-medium">Category:</span>
                        <span className="text-sm text-gray-300">{coupon.applicableCategory.name}</span>
                      </div>
                    );
                  } else if (coupon.applicableSubCategory?.name) {
                    return (
                      <div className="flex flex-col">
                        <span className="text-xs text-yellow-400 font-medium">Sub-Category:</span>
                        <span className="text-sm text-gray-300">{coupon.applicableSubCategory.name}</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex flex-col">
                        <span className="text-xs text-purple-400 font-medium">Universal:</span>
                        <span className="text-sm text-gray-300">All Products</span>
                      </div>
                    );
                  }
                };

                const formatExpiryDate = (dateString) => {
                  const date = new Date(dateString);
                  const now = new Date();
                  const diffTime = date - now;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  if (diffDays < 0) {
                    return (
                      <div className="flex flex-col">
                        <span className="text-red-400 text-xs font-medium">Expired</span>
                        <span className="text-gray-500 text-xs">{formattedDate}</span>
                      </div>
                    );
                  } else if (diffDays <= 7) {
                    return (
                      <div className="flex flex-col">
                        <span className="text-orange-400 text-xs font-medium">
                          {diffDays === 0 ? 'Today' : `${diffDays} days left`}
                        </span>
                        <span className="text-gray-300 text-xs">{formattedDate}</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex flex-col">
                        <span className="text-green-400 text-xs font-medium">{diffDays} days left</span>
                        <span className="text-gray-300 text-xs">{formattedDate}</span>
                      </div>
                    );
                  }
                };

                return (
                  <tr key={coupon._id} className="border-t border-gray-700 hover:bg-[#353b52] transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-purple-400">{coupon.couponCode}</span>
                        <span className="text-xs text-gray-500">
                          Created: {new Date(coupon.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.status === 'active'
                          ? 'bg-green-900 text-green-300 border border-green-700'
                          : 'bg-red-900 text-red-300 border border-red-700'
                        }`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 capitalize text-gray-300">{coupon.discountType}</td>
                    <td className="px-8 py-4">
                      <span className="font-bold text-yellow-400">
                        {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `Rs. ${coupon.discountAmount}`}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      {getApplicableTo()}
                    </td>
                    <td className="px-8 py-4 text-gray-300">
                      {coupon.minimumPurchaseAmount ? `Rs. ${coupon.minimumPurchaseAmount}` : 'N/A'}
                    </td>
                    <td className="px-8 py-4">
                      {formatExpiryDate(coupon.endDate)}
                    </td>
                    <td className="px-8 py-4">
                      <AddCouponDialog
                        onAddCoupon={onAddCoupon}
                        onEditCoupon={onEditCoupon}
                        initialData={coupon}
                        setEditingCoupon={setEditingCoupon}
                      >
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            title="Edit coupon"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                      </AddCouponDialog>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponTable;