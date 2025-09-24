"use client"

import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { storeApi } from "@/lib/utils"

export default function AddCouponDialog({ children, onAddCoupon, onEditCoupon, initialData }) {
  const [couponCode, setCouponCode] = useState("")
  const [discountType, setDiscountType] = useState("fixed")
  const [discountAmount, setDiscountAmount] = useState("")
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState("")
  const [selectDate, setSelectDate] = useState("")
  const [status, setStatus] = useState("active")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const data = storeApi.getAll();
  const categories = data.categories;

  useEffect(() => {
    if (initialData) {
      setCouponCode(initialData.couponCode || "");
      setDiscountType(initialData.discountType || "fixed");
      setDiscountAmount(initialData.discountAmount || "");
      setMinimumPurchaseAmount(initialData.minimumPurchaseAmount || "");
      setSelectDate(initialData.selectDate || "");
      setStatus(initialData.status || "active");
      setSelectedCategory(initialData.selectedCategory || "");
      setSelectedSubCategory(initialData.selectedSubCategory || "");
      setSelectedProduct(initialData.selectedProduct || "");
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

  const subcategories = data.subcategories.filter((s) => !selectedCategory || s.categoryId === selectedCategory);
  const products = data.products.filter((p) => !selectedCategory || p.categoryId === selectedCategory).filter((p) => !selectedSubCategory || p.subcategoryId === selectedSubCategory);

  const validateForm = () => {
    const newErrors = {};

    if (!couponCode.trim()) {
      newErrors.couponCode = "Coupon code is required.";
    }
    if (!discountAmount.trim() || isNaN(parseFloat(discountAmount)) || parseFloat(discountAmount) < 0) {
      newErrors.discountAmount = "Please enter a valid positive number for the discount amount.";
    } else if (discountType === "percentage" && parseFloat(discountAmount) > 100) {
      newErrors.discountAmount = "Percentage discount cannot exceed 100.";
    }
    if (minimumPurchaseAmount.trim() && (isNaN(parseFloat(minimumPurchaseAmount)) || parseFloat(minimumPurchaseAmount) < 0)) {
      newErrors.minimumPurchaseAmount = "Minimum purchase amount must be a valid positive number.";
    }
    if (!selectDate) {
      newErrors.selectDate = "Expiration date is required.";
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (selectDate < today) {
        newErrors.selectDate = "Expiration date cannot be in the past.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const couponData = {
      id: initialData?.id || Date.now(),
      couponCode,
      discountType,
      discountAmount: parseFloat(discountAmount),
      minimumPurchaseAmount: minimumPurchaseAmount ? parseFloat(minimumPurchaseAmount) : null,
      selectDate,
      status,
      selectedCategory,
      selectedSubCategory,
      selectedProduct,
    };

    if (initialData) {
      onEditCoupon(couponData);
    } else {
      onAddCoupon(couponData);
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT COUPON" : "ADD COUPON"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {initialData ? "Update the coupon details below." : "Fill out the details below to add a new coupon."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Coupon Code and Discount Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className={errors.couponCode ? "border-red-500" : ""}
              />
              {errors.couponCode && <p className="text-red-500 text-sm mt-1">{errors.couponCode}</p>}
            </div>
            <Select onValueChange={setDiscountType} value={discountType}>
              <SelectTrigger>
                <SelectValue placeholder="Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Amount and Minimum Purchase Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Discount Amount"
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className={errors.discountAmount ? "border-red-500" : ""}
              />
              {errors.discountAmount && <p className="text-red-500 text-sm mt-1">{errors.discountAmount}</p>}
            </div>
            <div>
              <Input
                placeholder="Minimum Purchase Amount"
                type="number"
                value={minimumPurchaseAmount}
                onChange={(e) => setMinimumPurchaseAmount(e.target.value)}
                className={errors.minimumPurchaseAmount ? "border-red-500" : ""}
              />
              {errors.minimumPurchaseAmount && <p className="text-red-500 text-sm mt-1">{errors.minimumPurchaseAmount}</p>}
            </div>
          </div>

          {/* Select Date and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="date"
                placeholder="Select Date"
                value={selectDate}
                onChange={(e) => setSelectDate(e.target.value)}
                className={errors.selectDate ? "border-red-500" : ""}
              />
              {errors.selectDate && <p className="text-red-500 text-sm mt-1">{errors.selectDate}</p>}
            </div>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category, Sub Category, and Product */}
          <div className="grid grid-cols-3 gap-4">
            <Select onValueChange={(val) => { setSelectedCategory(val); setSelectedSubCategory(""); }} value={selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="__no_categories__" disabled>No categories found</SelectItem>
                ) : (
                  categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedSubCategory} value={selectedSubCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select sub category" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.length === 0 ? (
                  <SelectItem value="__no_subcategories__" disabled>No subcategories found</SelectItem>
                ) : (
                  subcategories.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedProduct} value={selectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.length === 0 ? (
                  <SelectItem value="__no_products__" disabled>No products found</SelectItem>
                ) : (
                  products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" onClick={handleSubmit}>
              {initialData ? "Save Changes" : "Submit"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}