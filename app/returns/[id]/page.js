"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  RefreshCw,
} from "lucide-react";
import ProtectedLayout from "../../components/ProtectedLayout";

const ReturnDetails = () => {
  const params = useParams();
  const router = useRouter();
  const returnId = params.id;

  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const loadReturnDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/returns/${returnId}`
      );
      const data = await response.json();

      if (data.success) {
        setReturnData(data.data);
        setSelectedStatus(data.data.returnStatus);
        setAdminNotes(data.data.adminNotes || "");
      } else {
        throw new Error(data.message || "Failed to load return details");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (returnId) {
      loadReturnDetails();
    }
  }, [returnId]);

  const updateReturnStatus = async () => {
    if (!returnData || !selectedStatus) return;

    try {
      setUpdating(true);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/returns/${returnId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
            adminNotes: adminNotes.trim(),
            processedBy: "admin",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setReturnData(data.data);
        alert("Return status updated successfully");
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-blue-100 text-blue-800 border-blue-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      picked_up: "bg-purple-100 text-purple-800 border-purple-200",
      processing: "bg-indigo-100 text-indigo-800 border-indigo-200",
      refunded: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || colors.requested;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "requested":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "picked_up":
        return <Package className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4" />;
      case "refunded":
        return <DollarSign className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReasonDisplayText = (reason) => {
    const reasons = {
      defective_product: "Defective Product",
      wrong_item_received: "Wrong Item Received",
      size_issue: "Size Issue",
      quality_issue: "Quality Issue",
      not_as_described: "Not as Described",
      damaged_in_shipping: "Damaged in Shipping",
      changed_mind: "Changed Mind",
      other: "Other",
    };
    return reasons[reason] || reason;
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex min-h-screen bg-[#111827] text-white">
          <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
                <span className="text-gray-300 text-lg">
                  Loading return details...
                </span>
              </div>
            </div>
          </main>
        </div>
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="flex min-h-screen bg-[#111827] text-white">
          <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Error Loading Return
              </h3>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={loadReturnDetails}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </ProtectedLayout>
    );
  }

  if (!returnData) {
    return (
      <ProtectedLayout>
        <div className="flex min-h-screen bg-[#111827] text-white">
          <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
            <div className="text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Return Not Found
              </h3>
              <p className="text-gray-400">
                The return request you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </main>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
        <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-[#2a2f45] rounded-lg transition-colors border border-gray-700"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Return #{returnData.returnNumber}
                </h1>
                <p className="text-gray-400">Order #{returnData.orderNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  returnData.returnStatus
                )}`}
              >
                {getStatusIcon(returnData.returnStatus)}
                <span className="capitalize">{returnData.returnStatus}</span>
              </span>
              <button
                onClick={loadReturnDetails}
                className="p-2 hover:bg-[#2a2f45] rounded-lg transition-colors border border-gray-700"
              >
                <RefreshCw className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Return Information */}
              <div className="bg-[#2a2f45] rounded-xl shadow-sm border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Return Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Requested On</p>
                      <p className="font-medium text-white">
                        {formatDate(returnData.returnDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Return Type</p>
                      <p className="font-medium text-white capitalize">
                        {returnData.returnType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Return Amount</p>
                      <p className="font-medium text-white">
                        ₹{returnData.returnAmount?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Refund Method</p>
                      <p className="font-medium text-white capitalize">
                        {returnData.refundMethod?.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-[#2a2f45] rounded-xl shadow-sm border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Name</p>
                    <p className="font-medium text-white">
                      {returnData.userID?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="font-medium text-white">
                      {returnData.userID?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                    <p className="font-medium text-white">
                      {returnData.userID?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Return Details */}
              <div className="bg-[#2a2f45] rounded-xl shadow-sm border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Return Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Reason</p>
                    <p className="font-medium text-white">
                      {getReasonDisplayText(returnData.returnReason)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Description</p>
                    <p className="text-gray-300">
                      {returnData.returnDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Return Items */}
              <div className="bg-[#2a2f45] rounded-xl shadow-sm border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Return Items
                </h2>
                <div className="space-y-4">
                  {returnData.items?.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-600 rounded-lg p-4 bg-[#1e2235]"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            {item.productName}
                          </h3>
                          {item.variant && (
                            <p className="text-sm text-gray-400">
                              Variant: {item.variant}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                            <span>Return Qty: {item.returnQuantity}</span>
                            <span>Price: ₹{item.price?.toFixed(2)}</span>
                            <span className="capitalize">
                              Condition: {item.condition}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            ₹{(item.price * item.returnQuantity)?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-[#2a2f45] rounded-xl shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {returnData.returnStatus === "requested" && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedStatus("approved");
                          updateReturnStatus();
                        }}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStatus("rejected");
                          updateReturnStatus();
                        }}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  {returnData.returnStatus === "approved" && (
                    <button
                      onClick={() => {
                        setSelectedStatus("picked_up");
                        updateReturnStatus();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>Mark as Picked Up</span>
                    </button>
                  )}
                  {returnData.returnStatus === "picked_up" && (
                    <button
                      onClick={() => {
                        setSelectedStatus("processing");
                        updateReturnStatus();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Start Processing</span>
                    </button>
                  )}
                  {returnData.returnStatus === "processing" && (
                    <button
                      onClick={() => {
                        setSelectedStatus("refunded");
                        updateReturnStatus();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Mark as Refunded</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Status Management */}
              <div className="bg-[#2a2f45] rounded-xl shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Advanced Status Management
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Update Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-[#1e2235] text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="requested">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="processing">Processing</option>
                      <option value="refunded">Refunded</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      placeholder="Add notes about this return..."
                      className="w-full px-3 py-2 border border-gray-600 bg-[#1e2235] text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <button
                    onClick={updateReturnStatus}
                    disabled={
                      updating || selectedStatus === returnData.returnStatus
                    }
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update Status</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-[#2a2f45] rounded-xl shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Status Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">Return Requested</p>
                      <p className="text-sm text-gray-400">
                        {formatDate(returnData.returnDate)}
                      </p>
                    </div>
                  </div>

                  {returnData.processedAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-white">Processed</p>
                        <p className="text-sm text-gray-400">
                          {formatDate(returnData.processedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {returnData.refundedAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-white">Refunded</p>
                        <p className="text-sm text-gray-400">
                          {formatDate(returnData.refundedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default ReturnDetails;
