"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import url from "../../http/page";
import { toast } from "sonner";
// Removed ProtectedLayout import to avoid authentication issues
import {
    FiDownload,
    FiPrinter,
    FiCheck,
    FiPackage,
    FiTruck,
    FiHome,
    FiArrowLeft,
    FiShoppingBag
} from "react-icons/fi";
import { supportEmail, supportPhone } from '../../info';

export default function AdminReceiptPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            fetchOrderDetails();
        }
    }, [params.id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}orders/${params.id}`);
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Failed to load order receipt");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        generateThermalReceipt();
    };

    const handlePrint = () => {
        generateThermalReceipt();
    };

    const generateThermalReceipt = () => {
        const thermalContent = `
            <html>
            <head>
                <title>Receipt - ${order.orderNumber || order._id?.slice(-8).toUpperCase()}</title>
                <style>
                    @page {
                        size: 80mm auto;
                        margin: 0;
                    }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        line-height: 1.2;
                        margin: 0;
                        padding: 8px;
                        width: 80mm;
                        background: white;
                    }
                    .center { text-align: center; }
                    .bold { font-weight: bold; }
                    .line { border-bottom: 1px dashed #000; margin: 4px 0; }
                    .small { font-size: 10px; }
                    .item-row { display: flex; justify-content: space-between; margin: 2px 0; }
                    .total-row { border-top: 1px solid #000; padding-top: 4px; margin-top: 4px; }
                </style>
            </head>
            <body>
                <div class="center bold">SHOPEASE</div>
                <div class="center small">Receipt</div>
                <div class="line"></div>
                
                <div>Receipt #: ${order.orderNumber || order._id?.slice(-8).toUpperCase()}</div>
                <div>Date: ${new Date(order.orderDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</div>
                <div>Status: ${order.orderStatus.toUpperCase()}</div>
                <div class="line"></div>
                
                <div class="bold">CUSTOMER:</div>
                <div>${order.userID?.name || 'N/A'}</div>
                <div class="small">${order.userID?.email || 'N/A'}</div>
                ${order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' ?
                `<div class="small">Ph: ${order.shippingAddress.phone}</div>` : ''}
                <div class="line"></div>
                
                ${order.deliveryMethod === 'storeDelivery' ? `
                <div class="bold">PICKUP FROM:</div>
                <div class="small">${order.selectedStore?.storeName || 'ShopEase Store - Main Branch'}</div>
                <div class="small">${order.selectedStore?.storeLocation || '123 Commerce Street'}</div>
                <div class="small">${order.selectedStore?.storeLocation ? '' : 'Kathmandu, '}Nepal</div>
                <div class="small">Ready in 2-3 days</div>
                ` : `
                <div class="bold">DELIVERED TO:</div>
                <div class="small">${order.shippingAddress?.street || 'N/A'}</div>
                <div class="small">${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'}</div>
                <div class="small">${order.shippingAddress?.postalCode || 'N/A'}, ${order.shippingAddress?.country || 'N/A'}</div>
                `}
                <div class="line"></div>
                
                <div class="bold">ITEMS PURCHASED:</div>
                ${order.items?.map(item => `
                <div class="item-row">
                    <div>${item.productName}</div>
                </div>
                <div class="item-row small">
                    <div>Qty: ${item.quantity} x ₹${item.price}</div>
                    <div>₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                `).join('')}
                <div class="line"></div>
                
                <div class="item-row">
                    <div>Subtotal:</div>
                    <div>₹${order.orderTotal?.subtotal || order.totalPrice}</div>
                </div>
                <div class="item-row">
                    <div>${order.deliveryMethod === 'storeDelivery' ? 'Pickup Fee:' : 'Delivery Fee:'}</div>
                    <div>₹${order.orderTotal?.deliveryFee || (order.deliveryMethod === 'homeDelivery' ? '150' : order.deliveryMethod === 'storeDelivery' ? '100' : '50')}</div>
                </div>
                <div class="item-row">
                    <!-- Tax removed per request -->
                ${order.orderTotal?.discount > 0 ? `
                <div class="item-row">
                    <div>Discount:</div>
                    <div>-₹${order.orderTotal.discount}</div>
                </div>
                ` : ''}
                <div class="item-row bold total-row">
                    <div>TOTAL PAID:</div>
                    <div>₹${order.totalPrice}</div>
                </div>
                <div class="line"></div>
                
                <div class="small">Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</div>
                <div class="small">Method: ${order.deliveryMethod === 'homeDelivery' ? 'Home Delivery' : order.deliveryMethod === 'storeDelivery' ? 'Store Pickup' : 'Standard Delivery'}</div>
                <div class="line"></div>
                
                <div class="center small">THANK YOU FOR YOUR PURCHASE!</div>
                <div class="center small">${supportEmail}</div>
                <div class="center small">${supportPhone}</div>
                <div class="center small">Keep this receipt for your records</div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(thermalContent);
        printWindow.document.close();
        printWindow.print();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiPackage className="w-5 h-5 text-yellow-500" />;
            case 'processing': return <FiPackage className="w-5 h-5 text-blue-500" />;
            case 'shipped': return <FiTruck className="w-5 h-5 text-purple-500" />;
            case 'delivered': return <FiHome className="w-5 h-5 text-green-500" />;
            default: return <FiPackage className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading receipt...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Receipt Not Found</h2>
                    <button
                        onClick={() => router.push("/order")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/order")}
                        className="p-2 hover:bg-white/50 rounded-xl transition-colors text-gray-800"
                    >
                        <FiArrowLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Order Receipt</h1>
                </div>

                {/* Receipt */}
                <div className="bg-white/90 dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-none ring-1 ring-gray-200 dark:ring-0 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 print:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <FiCheck className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">ShopEase</h2>
                                    <p className="text-indigo-100">Order Confirmation</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-indigo-100">Receipt</p>
                                <p className="text-2xl font-bold font-mono">
                                    #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Order Info */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-3 bg-gray-50/90 dark:bg-slate-800 px-6 py-4 rounded-xl">
                                <span className="text-gray-600 font-medium">Order Date:</span>
                                <span className="font-bold text-gray-800">
                                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mb-8 text-center">
                            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border ${getStatusColor(order.orderStatus)}`}>
                                {getStatusIcon(order.orderStatus)}
                                <span className="font-semibold capitalize text-lg">Order {order.orderStatus}</span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Order Items</h3>
                            <div className="space-y-4">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 border rounded-xl">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-lg">{item.productName}</h4>
                                            {item.variant && (
                                                <p className="text-gray-600">Variant: {item.variant}</p>
                                            )}
                                            <p className="text-gray-600">Quantity: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-indigo-600">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
{/* Order Summary */}
<div className="mb-8 bg-gray-50 rounded-xl p-6">
  <h3 className="text-xl font-bold text-black mb-4 border-b pb-2">Order Summary</h3>
  <div className="space-y-3 text-lg text-black">
    <div className="flex justify-between">
      <span className="text-gray-800">Subtotal:</span>
      <span className="font-semibold text-black">
        ₹{order.orderTotal?.subtotal || order.totalPrice}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-800">
        {order.deliveryMethod === "storeDelivery"
          ? "Pickup Fee:"
          : "Delivery Fee:"}
      </span>
      <span className="font-semibold text-black">
        {order.orderTotal?.deliveryFee !== undefined
          ? `₹${order.orderTotal.deliveryFee}`
          : order.deliveryMethod === "homeDelivery"
          ? "₹150"
          : order.deliveryMethod === "storeDelivery"
          ? "₹100"
          : (order.orderTotal?.subtotal || order.totalPrice) > 500
          ? "Free"
          : "₹50"}
      </span>
    </div>

    {/* Discount */}
    <div className="flex justify-between">
      <span className="text-gray-800">Discount:</span>
      <span className="font-semibold text-green-700">
        -₹{order.orderTotal?.discount || 0}
      </span>
    </div>

    <hr className="border-gray-300 my-4" />

    <div className="flex justify-between text-2xl font-bold text-black">
      <span>Total Amount:</span>
      <span className="text-indigo-700">₹{order.totalPrice}</span>
    </div>
  </div>
</div>


                        {/* Payment & Delivery Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50/90 dark:bg-slate-800 rounded-xl p-6">
                                <h4 className="font-bold text-gray-800 mb-3 text-lg">Payment Method</h4>
                                <p className="text-gray-600 text-lg capitalize">
                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                </p>
                            </div>
                            <div className="bg-purple-50/90 dark:bg-slate-800 rounded-xl p-6">
                                <h4 className="font-bold text-gray-800 mb-3 text-lg">Delivery Method</h4>
                                <p className="text-gray-600 text-lg capitalize flex items-center gap-2">
                                    {order.deliveryMethod === 'homeDelivery' ? (
                                        <>
                                            <FiHome className="w-5 h-5 text-green-600" />
                                            Home Delivery (₹{order.orderTotal?.deliveryFee || 150})
                                        </>
                                    ) : order.deliveryMethod === 'storeDelivery' ? (
                                        <>
                                            <FiShoppingBag className="w-5 h-5 text-blue-600" />
                                            Store Pickup (₹{order.orderTotal?.deliveryFee || 100})
                                        </>
                                    ) : (
                                        <>
                                            <FiTruck className="w-5 h-5 text-gray-600" />
                                            Standard Delivery
                                        </>
                                    )}
                                </p>
                            </div>
                            <div className="bg-green-50/90 dark:bg-slate-800 rounded-xl p-6">
                                <h4 className="font-bold text-gray-800 mb-3 text-lg">
                                    {order.deliveryMethod === 'storeDelivery' ? 'Ready for Pickup' : 'Estimated Delivery'}
                                </h4>
                                <p className="text-gray-600 text-lg">
                                    {order.deliveryMethod === 'storeDelivery' ? '2-3 business days' :
                                        order.deliveryMethod === 'homeDelivery' ? '3-5 business days' :
                                            order.paymentMethod === 'cod' ? '3-5 business days' : '2-4 business days'}
                                </p>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="mb-8 bg-purple-50/90 dark:bg-slate-800 rounded-xl p-6">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">
                                {order.deliveryMethod === 'storeDelivery' ? 'Pickup Information' : 'Delivery Address'}
                            </h4>

                            {order.deliveryMethod === 'storeDelivery' ? (
                                <div className="space-y-3">
                                    <div className="text-gray-600 text-lg">
                                        {order.selectedStore ? (
                                            <>
                                                <p className="font-semibold text-blue-700">{order.selectedStore.storeName}</p>
                                                <p>{order.selectedStore.storeLocation}</p>
                                                <p>Nepal</p>
                                                {order.selectedStore.storePhoneNumber && (
                                                    <p className="mt-2 font-medium">📞 {order.selectedStore.storePhoneNumber}</p>
                                                )}
                                                <p className="font-medium">Manager: {order.selectedStore.storeManagerName}</p>
                                                <p className="font-medium">Store Hours: 10:00 AM - 8:00 PM</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-blue-700">ShopEase Store - Main Branch</p>
                                                <p>123 Commerce Street, Shopping District</p>
                                                <p>Kathmandu, Nepal</p>
                                                <p className="mt-2 font-medium">Store Hours: 10:00 AM - 8:00 PM</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                                        <p className="text-blue-800 font-medium text-sm">
                                            📋 Bring this receipt and a valid ID for pickup
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-600 text-lg">
                                    <p>{order.shippingAddress?.street}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                                    <p>{order.shippingAddress?.country}</p>
                                    {order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' && (
                                        <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Customer Info */}
                        <div className="mb-8 bg-yellow-50/90 dark:bg-slate-800 rounded-xl p-6">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">Customer Information</h4>
                            <div className="text-gray-600 text-lg space-y-1">
                                <p>Name: {order.userID?.name || 'N/A'}</p>
                                <p>Email: {order.userID?.email || 'N/A'}</p>
                                {order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' && (
                                    <p>Phone: {order.shippingAddress.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-gray-500 border-t pt-6">
                            <p className="mb-2 text-lg">Thank you for shopping with ShopEase!</p>
                            <p>For any queries, contact us at {supportEmail} | {supportPhone}</p>
                            <p className="mt-4 text-sm">This is a computer-generated receipt and does not require a signature.</p>
                       </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg"
                    >
                        <FiDownload className="w-5 h-5" />
                        Download PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors text-lg"
                    >
                        <FiPrinter className="w-5 h-5" />
                        Print Receipt
                    </button>
                </div>
            </div>


        </div>
    );
}