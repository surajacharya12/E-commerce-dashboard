"use client"

import { Trash2, RefreshCw } from "lucide-react";

const OrderTable = ({ orders, handleRefresh, handleDelete, statusFilter, setStatusFilter }) => {
  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Order</h2>
        <div className="flex items-center gap-8">
          <button onClick={handleRefresh} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="border border-gray-700 bg-[#2a2f45] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Status</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Pending</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Customer Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Order Amount</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Payment</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Status</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="6" className="px-12 py-4 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{order.customerName}</td>
                  <td className="px-12 py-4">${order.orderAmount.toFixed(2)}</td>
                  <td className="px-12 py-4">{order.payment}</td>
                  <td className="px-12 py-4">{order.status}</td>
                  <td className="px-12 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(order.id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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

export default OrderTable;