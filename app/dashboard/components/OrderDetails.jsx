"use client";

import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  PackageCheck,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const OrderDetails = ({ orders = [] }) => {
  // ✅ Ensure it's always an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  const orderCounts = {
    all: safeOrders.length,
    pending: safeOrders.filter(
      (o) => (o.orderStatus || "").toLowerCase() === "pending"
    ).length,
    processing: safeOrders.filter(
      (o) => (o.orderStatus || "").toLowerCase() === "processing"
    ).length,
    cancelled: safeOrders.filter(
      (o) => (o.orderStatus || "").toLowerCase() === "cancelled"
    ).length,
    shipped: safeOrders.filter(
      (o) => (o.orderStatus || "").toLowerCase() === "shipped"
    ).length,
    delivered: safeOrders.filter(
      (o) => (o.orderStatus || "").toLowerCase() === "delivered"
    ).length,
  };

  const orderItems = [
    { title: "All Orders", count: orderCounts.all, icon: FileText, color: "text-purple-500" },
    { title: "Pending Orders", count: orderCounts.pending, icon: Clock, color: "text-yellow-500" },
    { title: "Processing Orders", count: orderCounts.processing, icon: CheckCircle, color: "text-blue-500" },
    { title: "Cancelled Orders", count: orderCounts.cancelled, icon: XCircle, color: "text-red-500" },
    { title: "Shipped Orders", count: orderCounts.shipped, icon: Truck, color: "text-indigo-500" },
    { title: "Delivered Orders", count: orderCounts.delivered, icon: PackageCheck, color: "text-green-500" },
  ];

  const COLORS = ["#8884d8", "#ffc658", "#82ca9d", "#ff7300", "#00c49f", "#a29bfe"];
  const totalOrders = orderItems.reduce((acc, item) => acc + item.count, 0);
  const pieChartData = orderItems.map((item) => ({
    name: item.title,
    value: item.count,
  }));

  return (
    <aside className="w-92 h-screen bg-[#1e2235] text-white p-6 fixed right-0 top-0 flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Orders Details</h2>
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          {totalOrders > 0 ? (
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={55}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No orders to display.
            </div>
          )}
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-4 mt-4 overflow-y-auto">
        {orderItems.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-700 hover:bg-[#2a2f45] transition"
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm">{item.title}</span>
            </div>
            <span className="text-gray-400 text-xs">{item.count} Orders</span>
          </div>
        ))}

        {/* Recent Orders */}
        {safeOrders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Recent Orders</h3>
            <div className="space-y-2">
              {safeOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="p-3 rounded-lg border border-gray-700 hover:bg-[#2a2f45] transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-indigo-400">
                        #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.userID?.name || order.userID?.email || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-green-400">₹{order.totalPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${order.orderStatus === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          order.orderStatus === 'processing' ? 'bg-blue-900 text-blue-300' :
                            order.orderStatus === 'shipped' ? 'bg-purple-900 text-purple-300' :
                              order.orderStatus === 'delivered' ? 'bg-green-900 text-green-300' :
                                order.orderStatus === 'cancelled' ? 'bg-red-900 text-red-300' :
                                  'bg-gray-900 text-gray-300'
                        }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default OrderDetails;