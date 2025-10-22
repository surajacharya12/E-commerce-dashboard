import React from "react";
import { RefreshCw, Eye, Package, XCircle } from "lucide-react";
import Link from "next/link";

const ReturnsTable = ({
  returns,
  loading,
  error,
  selectedReturns,
  onSelectReturn,
  onSelectAll,
  updatingStatus,
  onStatusUpdate,
  onRetry,
}) => {
  const statusColors = {
    requested: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-blue-100 text-blue-800 border-blue-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    picked_up: "bg-purple-100 text-purple-800 border-purple-200",
    processing: "bg-indigo-100 text-indigo-800 border-indigo-200",
    refunded: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const statusLabels = {
    requested: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    picked_up: "Picked Up",
    processing: "Processing",
    refunded: "Refunded",
    cancelled: "Cancelled",
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = (returnItem, newStatus) => {
    const currentStatus = returnItem.returnStatus;

    // Confirm critical status changes
    if (newStatus === "rejected" || newStatus === "cancelled") {
      if (
        window.confirm(
          `Are you sure you want to ${
            newStatus === "rejected" ? "reject" : "cancel"
          } this return? This action will be saved to the database.`
        )
      ) {
        onStatusUpdate(returnItem._id, newStatus, currentStatus);
      } else {
        // Reset the dropdown to current status
        event.target.value = currentStatus;
      }
    } else if (newStatus !== currentStatus) {
      onStatusUpdate(returnItem._id, newStatus, currentStatus);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Returns
          </h3>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading returns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Returns
          </h3>
        </div>
        <div className="p-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (returns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Returns
          </h3>
        </div>
        <div className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No returns found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Returns</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={
                    selectedReturns.length === returns.length &&
                    returns.length > 0
                  }
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Return Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {returns.map((returnItem) => (
              <tr
                key={returnItem._id}
                className={`hover:bg-gray-50 ${
                  selectedReturns.includes(returnItem._id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedReturns.includes(returnItem._id)}
                    onChange={(e) =>
                      onSelectReturn(returnItem._id, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      #{returnItem.returnNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      Order #{returnItem.orderNumber}
                    </div>
                    <div className="text-xs text-gray-400">
                      {returnItem.items?.length || 0} item(s)
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {returnItem.userID?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {returnItem.userID?.email || "N/A"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <select
                      value={returnItem.returnStatus}
                      onChange={(e) =>
                        handleStatusChange(returnItem, e.target.value)
                      }
                      disabled={updatingStatus === returnItem._id}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                        statusColors[returnItem.returnStatus] ||
                        statusColors.requested
                      }`}
                    >
                      <option value="requested">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="processing">Processing</option>
                      <option value="refunded">Refunded</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingStatus === returnItem._id && (
                      <div className="flex items-center text-xs text-blue-600 mt-1 animate-pulse bg-blue-50 px-2 py-1 rounded">
                        <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                        <span className="font-medium">
                          💾 Saving to database...
                        </span>
                      </div>
                    )}
                    {updatingStatus !== returnItem._id && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        Ready to update
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{returnItem.returnAmount?.toFixed(2) || "0.00"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(returnItem.returnDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/returns/${returnItem._id}`}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnsTable;
