"use client";

import { Trash2, RefreshCw, Receipt, Eye } from "lucide-react";
import Link from "next/link";
import url from "../../http/page";
import { useState } from "react";
import Toast from "./Toast";

const OrderTable = ({
  orders,
  handleRefresh,
  handleDelete,
  statusFilter,
  setStatusFilter,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const response = await fetch(`${url}orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (response.ok) {
        // Refresh the orders list to show updated status
        handleRefresh();
        setToast({
          message: `Order status updated to ${newStatus}`,
          type: 'success'
        });
      } else {
        const errorData = await response.json();
        setToast({
          message: `Failed to update order status: ${errorData.message || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setToast({
        message: 'Error updating order status. Please try again.',
        type: 'error'
      });
    } finally {
      setUpdatingStatus(null);
    }
  };
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Order</h2>
        <div className="flex items-center gap-8">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700"
          >
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-700 bg-[#2a2f45] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Status</option>
            <option>processing</option>
            <option>shipped</option>
            <option>pending</option>
            <option>delivered</option>
            <option>cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">
                Order Number
              </th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">
                Customer Name
              </th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">
                Order Amount
              </th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">
                Payment
              </th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">
                Status
              </th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">
                Date
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td
                  colSpan="7"
                  className="px-12 py-4 text-center text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t border-gray-700">
                  <td className="px-12 py-4 font-mono text-sm">
                    {order.orderNumber || order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-12 py-4">
                    {order.userID?.name || order.userID?.email || "Unknown Customer"}
                  </td>
                  <td className="px-12 py-4">Rs. {order.totalPrice?.toFixed(2) || "0.00"}</td>
                  <td className="px-12 py-4 capitalize">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </td>
                  <td className="px-12 py-4">
                    <div className="flex flex-col">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingStatus === order._id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                          }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingStatus === order._id && (
                        <div className="text-xs text-gray-400 mt-1">Updating...</div>
                      )}
                    </div>
                  </td>
                  <td className="px-12 py-4">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Link
                        href={`/order-slip/${order._id}`}
                        className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                        title="View Order Slip"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/receipt/${order._id}`}
                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                        title="View Receipt"
                      >
                        <Receipt className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        title="Delete Order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default OrderTable;
