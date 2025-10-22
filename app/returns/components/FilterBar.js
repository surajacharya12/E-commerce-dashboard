import React from "react";
import { Filter } from "lucide-react";

const FilterBar = ({
  selectedStatus,
  onStatusChange,
  selectedReturns,
  onBulkUpdate,
  onClearSelection,
  bulkUpdating,
  returns,
}) => {
  const statusFilters = [
    { value: "", label: "All Returns" },
    { value: "requested", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "picked_up", label: "Picked Up" },
    { value: "processing", label: "Processing" },
    { value: "refunded", label: "Refunded" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filter by Status:</span>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onStatusChange(filter.value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === filter.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedReturns.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedReturns.length} selected
            </span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onBulkUpdate(e.target.value);
                  e.target.value = "";
                }
              }}
              disabled={bulkUpdating}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Bulk Update Status</option>
              <option value="approved">Approve All</option>
              <option value="rejected">Reject All</option>
              <option value="processing">Set Processing</option>
              <option value="refunded">Mark Refunded</option>
              <option value="cancelled">Cancel All</option>
            </select>
            <button
              onClick={onClearSelection}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Showing {returns.length} returns</span>
          <span>•</span>
          <span>
            Total Value: ₹
            {returns
              .reduce((sum, r) => sum + (r.returnAmount || 0), 0)
              .toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
