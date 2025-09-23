"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { storeApi } from "@/lib/utils"

export default function AddCouponDialog({ children }) {
  const [couponCode, setCouponCode] = useState("")
  const [discountType, setDiscountType] = useState("fixed") // Default to 'fixed'
  const [discountAmount, setDiscountAmount] = useState("")
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState("")
  const [selectDate, setSelectDate] = useState("") // For the date input
  const [status, setStatus] = useState("active") // Default to 'active'
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")

  const data = storeApi.getAll()
  const categories = data.categories
  const subcategories = data.subcategories.filter((s) => !selectedCategory || s.categoryId === selectedCategory)
  const products = data.products.filter((p)=> !selectedCategory || p.categoryId === selectedCategory).filter((p)=> !selectedSubCategory || p.subcategoryId === selectedSubCategory)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log({
      couponCode,
      discountType,
      discountAmount,
      minimumPurchaseAmount,
      selectDate,
      status,
      selectedCategory,
      selectedSubCategory,
      selectedProduct,
    })
    // Reset form fields after submission
    setCouponCode("")
    setDiscountType("fixed")
    setDiscountAmount("")
    setMinimumPurchaseAmount("")
    setSelectDate("")
    setStatus("active")
    setSelectedCategory("")
    setSelectedSubCategory("")
    setSelectedProduct("")
  }

  return (
    <AlertDialog>
      {children}

      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            ADD COUPON
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Coupon Code and Discount Type */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
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
            <Input
              placeholder="Discount Amount"
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
            />
            <Input
              placeholder="Minimum Purchase Amount"
              type="number"
              value={minimumPurchaseAmount}
              onChange={(e) => setMinimumPurchaseAmount(e.target.value)}
            />
          </div>

          {/* Select Date and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                type="date"
                placeholder="Select Date"
                value={selectDate}
                onChange={(e) => setSelectDate(e.target.value)}
                className="pr-10" // Adjust padding for date picker icon
              />
              {/* Optional: Add a calendar icon here if needed */}
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
            <Select onValueChange={(val)=>{ setSelectedCategory(val); setSelectedSubCategory("") }} value={selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="__no_categories__" disabled>No categories found</SelectItem>
                ) : (
                  categories.map((c)=> (
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
                  subcategories.map((s)=> (
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
                  products.map((p)=> (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}