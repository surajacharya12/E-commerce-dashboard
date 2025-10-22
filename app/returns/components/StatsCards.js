import React from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const StatsCards = ({ stats }) => {
  const statsConfig = [
    {
      key: "total",
      label: "Total",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
    },
    {
      key: "pending",
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      key: "approved",
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      key: "picked_up",
      label: "Picked Up",
      value: stats.picked_up,
      icon: Package,
      color: "text-purple-600",
    },
    {
      key: "processing",
      label: "Processing",
      value: stats.processing,
      icon: RefreshCw,
      color: "text-indigo-600",
    },
    {
      key: "refunded",
      label: "Refunded",
      value: stats.refunded,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      key: "amount",
      label: "Amount",
      value: `₹${(stats.totalAmount / 1000).toFixed(1)}K`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {statsConfig.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.key}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <IconComponent className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
