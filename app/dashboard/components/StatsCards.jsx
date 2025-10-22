"use client";

import { useState, useEffect } from "react";
import {
    ShoppingCart,
    Package,
    DollarSign,
    Users,
    RotateCcw,
    TrendingUp,
    TrendingDown,
    Clock
} from "lucide-react";
import url from "../../http/page";

const StatsCards = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalReturns: 0,
        pendingReturns: 0,
        refundedAmount: 0,
        returnRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [ordersRes, productsRes, returnsRes] = await Promise.all([
                fetch(`${url}orders`),
                fetch(`${url}products`),
                fetch(`${url}returns/admin/all?limit=1000`)
            ]);

            const ordersData = await ordersRes.json();
            const productsData = await productsRes.json();
            const returnsData = await returnsRes.json();

            // Calculate order stats
            const orders = Array.isArray(ordersData?.data) ? ordersData.data : ordersData || [];
            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

            // Get unique customers
            const uniqueCustomers = new Set(orders.map(order => order.userID)).size;

            // Calculate product stats
            const products = Array.isArray(productsData?.data) ? productsData.data : [];
            const totalProducts = products.length;

            // Calculate return stats
            const returns = Array.isArray(returnsData?.data) ? returnsData.data : [];
            const totalReturns = returns.length;
            const pendingReturns = returns.filter(r => r.returnStatus === 'requested').length;
            const refundedAmount = returns
                .filter(r => r.returnStatus === 'refunded')
                .reduce((sum, r) => sum + (r.returnAmount || 0), 0);
            const returnRate = totalOrders > 0 ? ((totalReturns / totalOrders) * 100) : 0;

            setStats({
                totalOrders,
                totalProducts,
                totalRevenue,
                totalCustomers: uniqueCustomers,
                totalReturns,
                pendingReturns,
                refundedAmount,
                returnRate
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, loading }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    {loading ? (
                        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    )}
                    {trend && trendValue && (
                        <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                                <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Orders"
                value={loading ? "..." : stats.totalOrders.toLocaleString()}
                icon={ShoppingCart}
                color="bg-blue-500"
                loading={loading}
            />

            <StatCard
                title="Total Products"
                value={loading ? "..." : stats.totalProducts.toLocaleString()}
                icon={Package}
                color="bg-green-500"
                loading={loading}
            />

            <StatCard
                title="Total Revenue"
                value={loading ? "..." : formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
                color="bg-purple-500"
                loading={loading}
            />

            <StatCard
                title="Total Customers"
                value={loading ? "..." : stats.totalCustomers.toLocaleString()}
                icon={Users}
                color="bg-indigo-500"
                loading={loading}
            />

            <StatCard
                title="Total Returns"
                value={loading ? "..." : stats.totalReturns.toLocaleString()}
                icon={RotateCcw}
                color="bg-orange-500"
                loading={loading}
            />

            <StatCard
                title="Pending Returns"
                value={loading ? "..." : stats.pendingReturns.toLocaleString()}
                icon={Clock}
                color="bg-yellow-500"
                loading={loading}
            />

            <StatCard
                title="Refunded Amount"
                value={loading ? "..." : formatCurrency(stats.refundedAmount)}
                icon={DollarSign}
                color="bg-red-500"
                loading={loading}
            />

            <StatCard
                title="Return Rate"
                value={loading ? "..." : `${stats.returnRate.toFixed(1)}%`}
                icon={TrendingUp}
                color={stats.returnRate > 10 ? "bg-red-500" : stats.returnRate > 5 ? "bg-yellow-500" : "bg-green-500"}
                loading={loading}
            />
        </div>
    );
};

export default StatsCards;