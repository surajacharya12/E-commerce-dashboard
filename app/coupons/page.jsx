"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        try {
            const response = await fetch('/api/couponCodes');
            const data = await response.json();

            if (data.success) {
                setCoupons(data.data);
            } else {
                toast.error('Failed to load coupons');
            }
        } catch (error) {
            toast.error('Error loading coupons');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCouponStatus = async (couponId) => {
        try {
            const response = await fetch(`/api/couponCodes/${couponId}/toggle-status`, {
                method: 'PATCH',
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                loadCoupons();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error updating coupon status');
        }
    };

    const deleteCoupon = async (couponId) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const response = await fetch(`/api/couponCodes/${couponId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Coupon deleted successfully');
                loadCoupons();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error deleting coupon');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New Coupon
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coupon Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Discount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Min. Purchase
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expires
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coupons.map((coupon) => (
                            <CouponRow
                                key={coupon._id}
                                coupon={coupon}
                                onToggleStatus={toggleCouponStatus}
                                onDelete={deleteCoupon}
                            />
                        ))}
                    </tbody>
                </table>

                {coupons.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No coupons found. Create your first coupon!</p>
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddCouponModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        loadCoupons();
                    }}
                />
            )}
        </div>
    );
}

function CouponRow({ coupon, onToggleStatus, onDelete }) {
    const formatDiscount = (coupon) => {
        if (coupon.discountType === 'fixed') {
            return `₹${coupon.discountAmount}`;
        } else {
            return `${coupon.discountAmount}%`;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const isExpired = new Date(coupon.endDate) < new Date();

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{coupon.couponCode}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDiscount(coupon)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">₹{coupon.minimumPurchaseAmount}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(coupon.endDate)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${coupon.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {coupon.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                    onClick={() => onToggleStatus(coupon._id)}
                    className={`${coupon.status === 'active'
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                >
                    {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                    onClick={() => onDelete(coupon._id)}
                    className="text-red-600 hover:text-red-900"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

function AddCouponModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        couponCode: '',
        discountType: 'percentage',
        discountAmount: '',
        minimumPurchaseAmount: '',
        endDate: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/couponCodes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Coupon created successfully!');
                onSuccess();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error creating coupon');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Coupon</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Coupon Code
                        </label>
                        <input
                            type="text"
                            value={formData.couponCode}
                            onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Type
                        </label>
                        <select
                            value={formData.discountType}
                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Amount
                        </label>
                        <input
                            type="number"
                            value={formData.discountAmount}
                            onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="1"
                            max={formData.discountType === 'percentage' ? '100' : undefined}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Purchase Amount
                        </label>
                        <input
                            type="number"
                            value={formData.minimumPurchaseAmount}
                            onChange={(e) => setFormData({ ...formData, minimumPurchaseAmount: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Coupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}