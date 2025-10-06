"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { checkAPIHealth } from "../api-health-check";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
console.log('Environment API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Final API_URL:', API_URL);

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        quantity: "",
        price: "",
        offerPrice: "",
        proCategoryId: "",
        proSubCategoryId: "",
        proBrandId: "",
        adminRating: "",
    });

    useEffect(() => {
        // Check API health first
        const initializeData = async () => {
            const healthCheck = await checkAPIHealth();
            if (!healthCheck.success) {
                toast.error(`API Connection Failed: ${healthCheck.error}`);
                console.error('API Health Check Failed:', healthCheck);
                setLoading(false);
                return;
            }

            // If API is healthy, fetch data
            fetchProducts();
            fetchCategories();
            fetchSubCategories();
            fetchBrands();
        };

        initializeData();
    }, []);

    const fetchProducts = async () => {
        try {
            console.log('=== FETCHING PRODUCTS ===');
            console.log('Fetching from:', `${API_URL}/products`);

            const response = await fetch(`${API_URL}/products`);

            console.log('Fetch response status:', response.status);
            console.log('Fetch response URL:', response.url);

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            console.log('Fetch response content-type:', contentType);

            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await response.text();
                console.error('Non-JSON response from /products:', textResponse.substring(0, 200) + '...');
                toast.error("API server is not responding correctly. Please check if the backend server is running.");
                return;
            }

            const result = await response.json();
            console.log('Fetch products success:', result.success);

            if (result.success) {
                setProducts(result.data);
            } else {
                toast.error(result.message || "Failed to fetch products");
            }
        } catch (error) {
            console.error('Fetch products error:', error);
            if (error.message.includes('Unexpected token')) {
                toast.error("Cannot connect to API server. Please ensure the backend is running on port 3001.");
            } else {
                toast.error("Failed to fetch products: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const result = await response.json();
            if (result.success) {
                setCategories(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/subCategories`);
            const result = await response.json();
            if (result.success) {
                setSubCategories(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch subcategories:", error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await fetch(`${API_URL}/brands`);
            const result = await response.json();
            if (result.success) {
                setBrands(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch brands:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.quantity || !formData.price || !formData.proCategoryId || !formData.proSubCategoryId) {
            toast.error("Please fill in all required fields");
            return;
        }

        // First check API health
        const healthCheck = await checkAPIHealth();
        if (!healthCheck.success) {
            toast.error(`API Connection Failed: ${healthCheck.error}`);
            console.error('API Health Check Failed before submit:', healthCheck);
            return;
        }

        try {
            const url = editingProduct
                ? `${API_URL}/products/${editingProduct._id}`
                : `${API_URL}/products`;

            const method = editingProduct ? "PUT" : "POST";

            // Send both quantity and stock to backend
            const submitData = {
                ...formData,
                quantity: formData.quantity, // Required field
                stock: formData.quantity,    // Use same value for stock
            };

            console.log('=== PRODUCT SUBMISSION DEBUG ===');
            console.log('API_URL:', API_URL);
            console.log('Submitting to:', url);
            console.log('Method:', method);
            console.log('Data being sent:', submitData);
            console.log('Required fields check:', {
                name: !!submitData.name,
                quantity: !!submitData.quantity,
                price: !!submitData.price,
                proCategoryId: !!submitData.proCategoryId,
                proSubCategoryId: !!submitData.proSubCategoryId
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(submitData),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            console.log('=== RESPONSE DEBUG ===');
            console.log('Response status:', response.status);
            console.log('Response URL:', response.url);
            console.log('Response OK:', response.ok);

            // Get response text first to avoid consuming the stream
            const responseText = await response.text();
            console.log('Raw response:', responseText.substring(0, 200));

            // Check if response is JSON by trying to parse it
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Response was:', responseText.substring(0, 500));

                if (responseText.includes('<!DOCTYPE')) {
                    toast.error("API server returned HTML instead of JSON. The backend might be down or misconfigured.");
                } else if (responseText.includes('Cannot')) {
                    toast.error("API endpoint not found. Check if the backend server is running correctly.");
                } else {
                    toast.error("Invalid response from server. Please check the backend server.");
                }
                return;
            }

            console.log('Parsed response data:', result);

            if (result.success) {
                toast.success(editingProduct ? "Product updated successfully" : "Product created successfully");
                setIsDialogOpen(false);
                resetForm();
                fetchProducts();
            } else {
                toast.error(result.message || "Operation failed");
            }
        } catch (error) {
            console.error('Submit error:', error);

            if (error.name === 'AbortError') {
                toast.error("Request timed out. Please check your connection and try again.");
            } else if (error.message.includes('Failed to fetch')) {
                toast.error("Cannot connect to API server. Please ensure the backend is running on port 3001.");
            } else if (error.message.includes('Unexpected token')) {
                toast.error("API server returned invalid data. Please check if the backend server is running correctly.");
            } else {
                toast.error("An error occurred: " + error.message);
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || "",
            description: product.description || "",
            quantity: product.stock?.toString() || product.quantity?.toString() || "", // Load stock as quantity
            price: product.price?.toString() || "",
            offerPrice: product.offerPrice?.toString() || "",
            proCategoryId: product.proCategoryId?._id || "",
            proSubCategoryId: product.proSubCategoryId?._id || "",
            proBrandId: product.proBrandId?._id || "",
            adminRating: product.rating?.adminRating?.toString() || "",
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
            });

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await response.text();
                console.error('Non-JSON response from DELETE:', textResponse);
                toast.error("API server error. Please check if the backend server is running.");
                return;
            }

            const result = await response.json();

            if (result.success) {
                toast.success("Product deleted successfully");
                fetchProducts();
            } else {
                toast.error(result.message || "Delete failed");
            }
        } catch (error) {
            console.error('Delete error:', error);
            if (error.message.includes('Unexpected token')) {
                toast.error("Cannot connect to API server. Please ensure the backend is running.");
            } else {
                toast.error("An error occurred: " + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            quantity: "",
            price: "",
            offerPrice: "",
            proCategoryId: "",
            proSubCategoryId: "",
            proBrandId: "",
            adminRating: "",
        });
        setEditingProduct(null);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const testAPIConnection = async () => {
        try {
            console.log('Testing API connection...');
            const response = await fetch(`${API_URL}/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            const text = await response.text();
            console.log('API Test Response:', text);

            const data = JSON.parse(text);
            if (data.success) {
                toast.success("API connection successful!");
            } else {
                toast.error("API responded but with error: " + data.message);
            }
        } catch (error) {
            console.error('API Test Error:', error);
            toast.error("API connection failed: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your product inventory and stock</p>
                    <p className="text-sm text-blue-600 mt-1">
                        💡 Tip: The "Stock Quantity" you enter will be displayed as available stock in the frontend
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button onClick={testAPIConnection} variant="outline" className="bg-green-50 hover:bg-green-100">
                        Test API
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingProduct ? "Edit Product" : "Add New Product"}
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Product Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="quantity">Stock Quantity *</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="0"
                                            value={formData.quantity}
                                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                                            placeholder="Enter stock quantity"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            This will be displayed as available stock in the frontend
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="adminRating">Admin Rating (1-5)</Label>
                                        <Input
                                            id="adminRating"
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={formData.adminRating}
                                            onChange={(e) => handleInputChange("adminRating", e.target.value)}
                                            placeholder="Enter rating (0-5)"
                                        />
                                    </div>

                                    <div>
                                        {/* Empty div for grid alignment */}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Price *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange("price", e.target.value)}
                                            placeholder="Enter price"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="offerPrice">Offer Price</Label>
                                        <Input
                                            id="offerPrice"
                                            type="number"
                                            step="0.01"
                                            value={formData.offerPrice}
                                            onChange={(e) => handleInputChange("offerPrice", e.target.value)}
                                            placeholder="Enter offer price"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={formData.proCategoryId} onValueChange={(value) => handleInputChange("proCategoryId", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="subcategory">Sub Category *</Label>
                                        <Select value={formData.proSubCategoryId} onValueChange={(value) => handleInputChange("proSubCategoryId", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select subcategory" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subCategories.map((subCategory) => (
                                                    <SelectItem key={subCategory._id} value={subCategory._id}>
                                                        {subCategory.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="brand">Brand</Label>
                                    <Select value={formData.proBrandId} onValueChange={(value) => handleInputChange("proBrandId", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand._id} value={brand._id}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        placeholder="Enter product description"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                        {editingProduct ? "Update Product" : "Create Product"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-gray-500" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {product._id.slice(-6)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {product.proCategoryId?.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {product.proSubCategoryId?.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            ${product.price}
                                        </div>
                                        {product.offerPrice && (
                                            <div className="text-sm text-green-600">
                                                Offer: ${product.offerPrice}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(product.stock || 0) > 10
                                            ? 'bg-green-100 text-green-800'
                                            : (product.stock || 0) > 0
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.stock || 0} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                            <span className="text-sm text-gray-900">
                                                {product.rating?.averageRating?.toFixed(1) || '0.0'}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({product.rating?.totalReviews || 0})
                                            </span>
                                        </div>
                                        {product.rating?.adminRating > 0 && (
                                            <div className="text-xs text-blue-600">
                                                Admin: {product.rating.adminRating}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(product._id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating a new product.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}