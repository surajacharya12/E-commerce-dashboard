"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import url from "../../http/page";
import { toast } from "sonner";
import {
    FiDownload,
    FiPrinter,
    FiPackage,
    FiTruck,
    FiHome,
    FiArrowLeft,
    FiClock,
    FiMapPin,
    FiPhone,
    FiMail,
    FiCalendar,
    FiCreditCard,
    FiShoppingBag
} from "react-icons/fi";
import { supportEmail, supportPhone } from '../../info';

export default function AdminOrderSlipPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancellation, setShowCancellation] = useState(false);
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
            toast.error("Failed to load order slip");
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
                <title>Order Slip - ${order.orderNumber || order._id?.slice(-8).toUpperCase()}</title>
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
                <div class="center bold">ShopSwift</div>
                <div class="center small">Order Slip</div>
                <div class="line"></div>
                
                <div>Order #: ${order.orderNumber || order._id?.slice(-8).toUpperCase()}</div>
                <div>Date: ${new Date(order.orderDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</div>
                <div>Status: ${order.orderStatus.toUpperCase()}</div>
                <div class="line"></div>
                
                <div class="bold">CUSTOMER INFO:</div>
                <div>${order.userID?.name || 'N/A'}</div>
                <div class="small">${order.userID?.email || 'N/A'}</div>
                ${order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' ?
                `<div class="small">Ph: ${order.shippingAddress.phone}</div>` : ''}
                <div class="line"></div>
                
                ${order.deliveryMethod === 'storeDelivery' ? `
                <div class="bold">PICKUP LOCATION:</div>
                <div class="small">${order.selectedStore?.storeName || 'ShopSwift Store - Main Branch'}</div>
                <div class="small">${order.selectedStore?.storeLocation || '123 Commerce Street'}</div>
                <div class="small">${order.selectedStore?.storeLocation ? '' : 'Kathmandu, '}Nepal</div>
                ${order.selectedStore?.storePhoneNumber ? `<div class="small">Ph: ${order.selectedStore.storePhoneNumber}</div>` : ''}
                <div class="small">Hours: 10:00 AM - 8:00 PM</div>
                <div class="small bold">* Bring ID & this slip *</div>
                ` : `
                <div class="bold">DELIVERY ADDRESS:</div>
                <div class="small">${order.shippingAddress?.street || 'N/A'}</div>
                <div class="small">${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'}</div>
                <div class="small">${order.shippingAddress?.postalCode || 'N/A'}, ${order.shippingAddress?.country || 'N/A'}</div>
                `}
                <div class="line"></div>
                
                <div class="bold">ITEMS:</div>
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
                    <div>TOTAL:</div>
                    <div>₹${order.totalPrice}</div>
                </div>
                <div class="line"></div>
                
                <div class="small">Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</div>
                <div class="small">Method: ${order.deliveryMethod === 'homeDelivery' ? 'Home Delivery' : order.deliveryMethod === 'storeDelivery' ? 'Store Pickup' : 'Standard Delivery'}</div>
                <div class="line"></div>
                
                <div class="center small">Thank you for shopping!</div>
                <div class="center small">${supportEmail}</div>
                <div class="center small">${supportPhone}</div>
                <div class="center small">Generated from Admin Dashboard</div>
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
            case 'pending': return <FiClock className="w-6 h-6 text-yellow-500" />;
            case 'processing': return <FiPackage className="w-6 h-6 text-blue-500" />;
            case 'shipped': return <FiTruck className="w-6 h-6 text-purple-500" />;
            case 'delivered': return <FiHome className="w-6 h-6 text-green-500" />;
            default: return <FiPackage className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case 'pending': return 'Order has been placed and is being processed.';
            case 'processing': return 'Order is being prepared for shipment.';
            case 'shipped': return 'Order is on the way to delivery address.';
            case 'delivered': return 'Order has been successfully delivered.';
            case 'cancelled': return 'Order has been cancelled.';
            default: return 'Order status is being updated.';
        }
    };

    const getDeliveryEstimate = (orderDate, status, paymentMethod) => {
        if (status === 'delivered') return 'Delivered';
        if (status === 'cancelled') return 'Cancelled';

        const orderDateObj = new Date(orderDate);
        const deliveryDays = paymentMethod === 'cod' ? 5 : 4;
        const estimatedDelivery = new Date(orderDateObj);
        estimatedDelivery.setDate(orderDateObj.getDate() + deliveryDays);

        return estimatedDelivery.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading order slip...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Slip Not Found</h2>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 mt-10">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/order")}
                            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                        >
                            <FiArrowLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Order Slip</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            <FiDownload className="w-4 h-4" />
                            Download
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                            <FiPrinter className="w-4 h-4" />
                            Print
                        </button>
                    </div>
                </div>

                {/* Order Slip */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <FiShoppingBag className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">ShopSwift</h2>
                                    <p className="text-indigo-100">Order Slip</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-indigo-100">Order Number</p>
                                <p className="text-3xl font-bold font-mono">
                                    {order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl border-2 ${getStatusColor(order.orderStatus)}`}>
                                    {getStatusIcon(order.orderStatus)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 capitalize">
                                        Order {order.orderStatus}
                                    </h3>
                                    <p className="text-gray-600 text-lg">
                                        {getStatusMessage(order.orderStatus)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-600">Expected Delivery</p>
                                <p className="text-lg font-bold text-indigo-600">
                                    {getDeliveryEstimate(order.orderDate, order.orderStatus, order.paymentMethod)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Progress */}
                    <div className="p-6 bg-white">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Order Progress</h3>
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${order.orderStatus === 'pending' ? 'w-1/4 bg-yellow-500' :
                                        order.orderStatus === 'processing' ? 'w-2/4 bg-blue-500' :
                                            order.orderStatus === 'shipped' ? 'w-3/4 bg-purple-500' :
                                                order.orderStatus === 'delivered' ? 'w-full bg-green-500' :
                                                    'w-0 bg-gray-400'
                                        }`}
                                />
                            </div>

                            {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => (
                                <div key={status} className="flex flex-col items-center relative z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${order.orderStatus === status ? 'bg-indigo-600 border-indigo-600 text-white' :
                                        ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) > index ?
                                            'bg-green-500 border-green-500 text-white' :
                                            'bg-white border-gray-300 text-gray-400'
                                        }`}>
                                        {status === 'pending' && <FiClock className="w-5 h-5" />}
                                        {status === 'processing' && <FiPackage className="w-5 h-5" />}
                                        {status === 'shipped' && <FiTruck className="w-5 h-5" />}
                                        {status === 'delivered' && <FiHome className="w-5 h-5" />}
                                    </div>
                                    <p className={`mt-2 text-sm font-medium capitalize ${order.orderStatus === status ? 'text-indigo-600' :
                                        ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) > index ?
                                            'text-green-600' : 'text-gray-400'
                                        }`}>
                                        {status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Order Information */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                                    <FiCalendar className="w-5 h-5 text-indigo-600" />
                                    Order Information
                                </h3>
                                <div className="space-y-3 text-black">
                                    <div className="flex justify-between">
                                        <span className="text-gray-800">Order Date:</span>
                                        <span className="font-semibold text-black">
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-800">Order Number:</span>
                                        <span className="font-semibold font-mono text-black">
                                            {order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-800">Payment Method:</span>
                                        <span className="font-semibold capitalize text-black">
                                            {order.paymentMethod === 'cod'
                                                ? 'Cash on Delivery'
                                                : 'Online Payment'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-800">Delivery Method:</span>
                                        <span className="font-semibold capitalize flex items-center gap-1 text-black">
                                            {order.deliveryMethod === 'homeDelivery' ? (
                                                <>
                                                    <FiHome className="w-4 h-4 text-green-600" />
                                                    Home Delivery
                                                </>
                                            ) : order.deliveryMethod === 'storeDelivery' ? (
                                                <>
                                                    <FiShoppingBag className="w-4 h-4 text-blue-600" />
                                                    Store Pickup
                                                </>
                                            ) : (
                                                <>
                                                    <FiTruck className="w-4 h-4 text-gray-600" />
                                                    Standard Delivery
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-800">Total Amount:</span>
                                        <span className="font-bold text-xl text-indigo-700">
                                            ₹{order.totalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-blue-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                                    <FiMail className="w-5 h-5 text-blue-600" />
                                    Customer Information
                                </h3>
                                <div className="space-y-3 text-black">
                                    <div className="flex justify-between">
                                        <span className="text-gray-800">Name:</span>
                                        <span className="font-semibold text-black">
                                            {order.userID?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-800">Email:</span>
                                        <span className="font-semibold text-black">
                                            {order.userID?.email || 'N/A'}
                                        </span>
                                    </div>
                                    {order.shippingAddress?.phone &&
                                        order.shippingAddress.phone !== 'N/A' && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-800">Phone:</span>
                                                <span className="font-semibold text-black">
                                                    {order.shippingAddress.phone}
                                                </span>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FiMapPin className="w-5 h-5 text-purple-600" />
                            {order.deliveryMethod === 'storeDelivery' ? 'Pickup Information' : 'Delivery Address'}
                        </h3>

                        {order.deliveryMethod === 'storeDelivery' ? (
                            <div className="space-y-4">
                                <div className="bg-blue-100 border border-blue-300 rounded-xl p-4">
                                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                        <FiShoppingBag className="w-5 h-5" />
                                        Store Pickup Details
                                    </h4>
                                    <div className="text-blue-700 space-y-1">
                                        {order.selectedStore ? (
                                            <>
                                                <p className="font-semibold">{order.selectedStore.storeName}</p>
                                                <p>{order.selectedStore.storeLocation}</p>
                                                <p>Nepal</p>
                                                {order.selectedStore.storePhoneNumber && (
                                                    <p className="font-medium mt-2">📞 {order.selectedStore.storePhoneNumber}</p>
                                                )}
                                                <p className="font-medium">Manager: {order.selectedStore.storeManagerName}</p>
                                                <p className="font-medium">Store Hours: 10:00 AM - 8:00 PM (Mon-Sun)</p>
                                                {order.deliveryMethod === 'storeDelivery' && (
                                                    <p className="font-medium">Pickup Fee: ₹{order.orderTotal?.deliveryFee || 100}</p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold">ShopSwift Store - Main Branch</p>
                                                <p>123 Commerce Street, Shopping District</p>
                                                <p>Kathmandu, Nepal</p>
                                                <p className="font-medium mt-2">Store Hours: 10:00 AM - 8:00 PM (Mon-Sun)</p>
                                                {order.deliveryMethod === 'storeDelivery' && (
                                                    <p className="font-medium">Pickup Fee: ₹{order.orderTotal?.deliveryFee || 100}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                                    <h4 className="font-bold text-yellow-800 mb-2">Pickup Instructions:</h4>
                                    <ul className="text-yellow-700 space-y-1 text-sm">
                                        <li>• Bring a valid ID and this order slip</li>
                                        <li>• Order will be ready for pickup in 2-3 business days</li>
                                        <li>• You'll receive a pickup notification via SMS/Email</li>
                                        <li>• Items will be held for 7 days after notification</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-gray-700 text-lg leading-relaxed">
                                    <p className="font-semibold">{order.shippingAddress?.street}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                    <p>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
                                    {order.shippingAddress?.phone && order.shippingAddress.phone !== 'N/A' && (
                                        <p className="mt-2 font-medium">Contact: {order.shippingAddress.phone}</p>
                                    )}
                                </div>
                                <div className="bg-green-100 border border-green-300 rounded-xl p-4">
                                    <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                        <FiHome className="w-5 h-5" />
                                        Home Delivery Details
                                    </h4>
                                    <div className="text-green-700 space-y-1">
                                        {order.deliveryMethod === 'homeDelivery' && (
                                            <p className="font-medium">Delivery Fee: ₹{order.orderTotal?.deliveryFee || 150}</p>
                                        )}
                                        <p>Estimated Delivery: 3-5 business days</p>
                                        <p>Delivery Time: 9:00 AM - 6:00 PM</p>
                                        <p className="text-sm mt-2">• Please ensure someone is available to receive the order</p>
                                        <p className="text-sm">• ID verification may be required</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FiShoppingBag className="w-5 h-5 text-green-600" />
                            Order Items ({order.items?.length || 0})
                        </h3>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-6 border-2 border-gray-200 rounded-2xl hover:border-indigo-300 transition-colors">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-gray-800">{item.productName}</h4>
                                        {item.variant && (
                                            <p className="text-gray-600 mt-1">Variant: {item.variant}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-gray-600">Quantity: {item.quantity}</span>
                                            <span className="text-gray-600">Price: ₹{item.price} each</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-2xl text-indigo-600">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FiCreditCard className="w-5 h-5 text-indigo-600" />
                            Order Summary
                        </h3>
                        <div className="space-y-4 text-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold">₹{order.orderTotal?.subtotal || order.totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    {order.deliveryMethod === 'storeDelivery' ? 'Pickup Fee:' : 'Delivery Fee:'}
                                </span>
                                <span className="font-semibold">
                                    {order.orderTotal?.deliveryFee !== undefined ?
                                        `₹${order.orderTotal.deliveryFee}` :
                                        order.deliveryMethod === 'homeDelivery' ? '₹150' :
                                            order.deliveryMethod === 'storeDelivery' ? '₹100' :
                                                (order.orderTotal?.subtotal || order.totalPrice) > 500 ? 'Free' : '₹50'}
                                </span>
                            </div>
                            {/* Tax removed per request */}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Discount:</span>
                                <span className="font-semibold text-green-600">-₹{order.orderTotal?.discount || 0}</span>
                            </div>
                            <hr className="border-gray-300 my-4" />
                            <div className="flex justify-between text-2xl font-bold">
                                <span>Total Amount:</span>
                                <span className="text-indigo-600">₹{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Information */}
                    {order.trackingUrl && (
                        <div className="bg-green-50 rounded-2xl p-6 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FiTruck className="w-5 h-5 text-green-600" />
                                Track Your Order
                            </h3>
                            <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                            >
                                <FiTruck className="w-5 h-5" />
                                Track Package
                            </a>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center text-gray-500 border-t-2 border-gray-200 pt-8">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-gray-800 mb-2">Thank you for shopping with ShopSwift!</h4>
                            <p className="text-lg">We appreciate your business and hope you love your purchase.</p>
                        </div>
                        <div className="space-y-2">
                            <p>For any queries or support, contact us:</p>
                            <p className="flex items-center justify-center gap-4">
                                <span className="flex items-center gap-1">
                                    <FiMail className="w-4 h-4" />
                                    {supportEmail}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiPhone className="w-4 h-4" />
                                    {supportPhone}
                                </span>
                            </p>
                            <p className="text-sm mt-4">This order slip is valid until delivery completion.</p>
                            <p className="text-xs text-gray-400 mt-2">Generated from Admin Dashboard</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
}