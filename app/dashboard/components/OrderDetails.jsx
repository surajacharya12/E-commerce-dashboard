"use client";

import { FileText, Clock, CheckCircle, XCircle, Truck, PackageCheck } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const OrderDetails = ({ orders = [] }) => {
  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processed: orders.filter(o => o.status === 'Processed').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  const orderItems = [
    { title: "All Orders", count: orderCounts.all, icon: FileText, color: "text-purple-500" },
    { title: "Pending Orders", count: orderCounts.pending, icon: Clock, color: "text-yellow-500" },
    { title: "Processed Orders", count: orderCounts.processed, icon: CheckCircle, color: "text-blue-500" },
    { title: "Cancelled Orders", count: orderCounts.cancelled, icon: XCircle, color: "text-red-500" },
    { title: "Shipped Orders", count: orderCounts.shipped, icon: Truck, color: "text-indigo-500" },
    { title: "Delivered Orders", count: orderCounts.delivered, icon: PackageCheck, color: "text-green-500" },
  ];

  const COLORS = ['#8884d8', '#ffc658', '#82ca9d', '#ff7300', '#00c49f', '#a29bfe'];
  const totalOrders = orderItems.reduce((acc, item) => acc + item.count, 0);
  const pieChartData = orderItems.map(item => ({ name: item.title, value: item.count }));

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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
      <div className="flex-1 space-y-4 mt-4">
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
      </div>
    </aside>
  );
};

export default OrderDetails;