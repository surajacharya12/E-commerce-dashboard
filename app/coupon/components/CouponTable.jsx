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
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Coupon Code</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Status</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Type</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Amount</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Min. Purchase</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">End Date</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="8" className="px-12 py-4 text-center text-gray-400">
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{coupon.couponCode}</td>
                  <td className="px-12 py-4 capitalize">{coupon.status}</td>
                  <td className="px-12 py-4 capitalize">{coupon.discountType}</td>
                  <td className="px-12 py-4">
                    {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `Rs. ${coupon.discountAmount}`}
                  </td>
                  <td className="px-12 py-4">
                    {coupon.minimumPurchaseAmount ? `Rs. ${coupon.minimumPurchaseAmount}` : 'N/A'}
                  </td>
                  <td className="px-12 py-4">{new Date(coupon.selectDate).toLocaleDateString()}</td>
                  <td className="px-12 py-4">
                    <AddCouponDialog
                      onAddCoupon={onAddCoupon}
                      onEditCoupon={onEditCoupon}
                      initialData={coupon}
                      setEditingCoupon={setEditingCoupon}
                    >
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddCouponDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
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

export default CouponTable;