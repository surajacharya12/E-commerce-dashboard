"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import url from "../../http/page";
import { Label } from "@/components/ui/label";

export default function AddCouponDialog({ children, onAddCoupon, onEditCoupon, initialData, setEditingCoupon }) {
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("fixed");
  const [discountAmount, setDiscountAmount] = useState("");
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState("");
  const [selectDate, setSelectDate] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchDialogData = async () => {
    try {
      const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
        fetch(`${url}categories`),
        fetch(`${url}subCategories`),
        fetch(`${url}products`),
      ]);
      const [categoriesData, subcategoriesData, productsData] = await Promise.all([
        categoriesRes.json(),
        subcategoriesRes.json(),
        productsRes.json(),
      ]);
      setCategories(categoriesData.data || []);
      setSubcategories(subcategoriesData.data || []);
      setProducts(productsData.data || []);
    } catch (error) {
      console.error("Failed to fetch dialog data:", error);
      toast.error("Failed to load categories, subcategories, or products.");
    }
  };

  useEffect(() => {
    fetchDialogData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setCouponCode(initialData.couponCode || "");
      setDiscountType(initialData.discountType || "fixed");
      setDiscountAmount(String(initialData.discountAmount || ""));
      setMinimumPurchaseAmount(String(initialData.minimumPurchaseAmount || ""));
      setSelectDate(initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "");
      setStatus(initialData.status || "active");
      setSelectedCategory(initialData.applicableCategory?._id || "");
      setSelectedSubCategory(initialData.applicableSubCategory?._id || "");
      setSelectedProduct(initialData.applicableProduct?._id || "");
    } else {
      setCouponCode("");
      setDiscountType("fixed");
      setDiscountAmount("");
      setMinimumPurchaseAmount("");
      setSelectDate("");
      setStatus("active");
      setSelectedCategory("");
      setSelectedSubCategory("");
      setSelectedProduct("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const filteredSubcategories = subcategories.filter(
    (s) => !selectedCategory || s.categoryId?._id === selectedCategory
  );
  const filteredProducts = products
    .filter((p) => !selectedCategory || p.proCategoryId?._id === selectedCategory)
    .filter((p) => !selectedSubCategory || p.proSubCategoryId?._id === selectedSubCategory);

  const validateForm = () => {
    const newErrors = {};

    // Validate coupon code
    if (!couponCode.trim()) {
      newErrors.couponCode = "Coupon code is required.";
    } else if (couponCode.trim().length < 3) {
      newErrors.couponCode = "Coupon code must be at least 3 characters long.";
    }

    // Validate discount amount
    if (!String(discountAmount).trim() || isNaN(parseFloat(discountAmount)) || parseFloat(discountAmount) <= 0) {
      newErrors.discountAmount = "Please enter a valid positive number.";
    } else if (discountType === "percentage" && parseFloat(discountAmount) > 100) {
      newErrors.discountAmount = "Percentage discount cannot exceed 100.";
    }

    // Validate minimum purchase amount (optional field)
    if (String(minimumPurchaseAmount).trim() && (isNaN(parseFloat(minimumPurchaseAmount)) || parseFloat(minimumPurchaseAmount) < 0)) {
      newErrors.minimumPurchaseAmount = "Minimum purchase amount must be a valid positive number.";
    }

    // Validate expiration date
    if (!selectDate) {
      newErrors.selectDate = "Expiration date is required.";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (selectDate < today) {
        newErrors.selectDate = "Expiration date cannot be in the past.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    // Create a plain object instead of FormData for JSON API
    const couponData = {
      couponCode: couponCode.trim().toUpperCase(),
      discountType,
      discountAmount: parseFloat(discountAmount),
      minimumPurchaseAmount: minimumPurchaseAmount ? parseFloat(minimumPurchaseAmount) : 0,
      endDate: selectDate,
      status,
      applicableCategory: selectedCategory === "__none__" || !selectedCategory ? null : selectedCategory,
      applicableSubCategory: selectedSubCategory === "__none__" || !selectedSubCategory ? null : selectedSubCategory,
      applicableProduct: selectedProduct === "__none__" || !selectedProduct ? null : selectedProduct,
    };

    console.log("Submitting coupon data:", couponData);

    try {
      if (initialData) {
        await onEditCoupon(initialData._id, couponData);
      } else {
        await onAddCoupon(couponData);
      }
      setIsOpen(false);
      // Reset form
      setCouponCode("");
      setDiscountAmount("");
      setMinimumPurchaseAmount("");
      setSelectDate("");
      setSelectedCategory("");
      setSelectedSubCategory("");
      setSelectedProduct("");
    } catch (error) {
      console.error("Error submitting coupon:", error);
      toast.error("Failed to save coupon. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      console.log("Dialog open state changed:", open);
      setIsOpen(open);
      if (!open && setEditingCoupon) {
        setEditingCoupon(null);
      }
    }}>
      {children}
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            {initialData ? "EDIT COUPON" : "ADD NEW COUPON"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {initialData ? "Update the coupon details below." : "Fill out the details below to add a new coupon."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="couponCode">Coupon Code</Label>
              <Input
                id="couponCode"
                placeholder="e.g., SAVEBIG20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className={errors.couponCode ? "border-red-500" : ""}
              />
              {errors.couponCode && <p className="text-red-500 text-sm mt-1">{errors.couponCode}</p>}
            </div>
            <div className="space-y-4">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select onValueChange={setDiscountType} value={discountType}>
                <SelectTrigger id="discountType">
                  <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="discountAmount">Discount Amount</Label>
              <Input
                id="discountAmount"
                placeholder="Amount"
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className={errors.discountAmount ? "border-red-500" : ""}
              />
              {errors.discountAmount && <p className="text-red-500 text-sm mt-1">{errors.discountAmount}</p>}
            </div>
            <div className="space-y-4">
              <Label htmlFor="minPurchase">Minimum Purchase Amount</Label>
              <Input
                id="minPurchase"
                placeholder="Optional"
                type="number"
                value={minimumPurchaseAmount}
                onChange={(e) => setMinimumPurchaseAmount(e.target.value)}
                className={errors.minimumPurchaseAmount ? "border-red-500" : ""}
              />
              {errors.minimumPurchaseAmount && <p className="text-red-500 text-sm mt-1">{errors.minimumPurchaseAmount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="expDate">Expiration Date</Label>
              <Input
                id="expDate"
                type="date"
                value={selectDate}
                onChange={(e) => setSelectDate(e.target.value)}
                className={errors.selectDate ? "border-red-500" : ""}
              />
              {errors.selectDate && <p className="text-red-500 text-sm mt-1">{errors.selectDate}</p>}
            </div>
            <div className="space-y-4">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={setStatus} value={status}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(val) => {
                  setSelectedCategory(val);
                  setSelectedSubCategory("");
                  setSelectedProduct("");
                }}
                value={selectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {categories.length === 0 ? (
                    <SelectItem value="__no_categories__" disabled>No categories found</SelectItem>
                  ) : (
                    categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label htmlFor="subCategory">Subcategory</Label>
              <Select onValueChange={(val) => { setSelectedSubCategory(val); setSelectedProduct(""); }} value={selectedSubCategory} disabled={!selectedCategory || selectedCategory === "__none__"}>
                <SelectTrigger id="subCategory">
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {filteredSubcategories.length === 0 ? (
                    <SelectItem value="__no_subcategories__" disabled>No subcategories found</SelectItem>
                  ) : (
                    filteredSubcategories.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label htmlFor="product">Product</Label>
              <Select onValueChange={setSelectedProduct} value={selectedProduct} disabled={!selectedSubCategory || selectedSubCategory === "__none__"}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {filteredProducts.length === 0 ? (
                    <SelectItem value="__no_products__" disabled>No products found</SelectItem>
                  ) : (
                    filteredProducts.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Add Coupon")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}