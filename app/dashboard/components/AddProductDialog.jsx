"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { storeApi } from "@/lib/utils"

export default function AddProductDialog({ children }) {
  // Store selected images
  const [images, setImages] = useState(Array(5).fill(null))
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("")
  const [brandId, setBrandId] = useState("")
  const [variantTypeId, setVariantTypeId] = useState("")
  const [variantId, setVariantId] = useState("")

  const data = storeApi.getAll()
  const categories = data.categories
  const subcategories = data.subcategories.filter((s) => !categoryId || s.categoryId === categoryId)
  const brands = data.brands.filter((b) => !subcategoryId || b.subcategoryId === subcategoryId)
  const variantTypes = data.variantTypes
  const variants = data.variants.filter((v) => !variantTypeId || v.variantTypeId === variantTypeId)

  const handleImageChange = (index, file) => {
    if (file) {
      const newImages = [...images]
      newImages[index] = URL.createObjectURL(file) // preview URL
      setImages(newImages)
    }
  }

  return (
    <AlertDialog>
      {children}

      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            ADD PRODUCT
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Fill out the details below to add a new product.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* FORM START */}
        <form className="space-y-4 mt-4" onSubmit={(e)=>{
          e.preventDefault();
          const productName = (e.target.querySelector('input[placeholder="Product Name"]').value || '').trim();
          const description = (e.target.querySelector('textarea[placeholder="Product Description"]').value || '').trim();
          const price = (e.target.querySelector('input[placeholder="Price"]').value || '').trim();
          const offerPrice = (e.target.querySelector('input[placeholder="Offer Price"]').value || '').trim();
          const quantity = (e.target.querySelector('input[placeholder="Quantity"]').value || '').trim();
          if (!productName || !categoryId || !subcategoryId || !brandId) return;
          storeApi.addProduct({ name: productName, description, price, offerPrice, quantity, categoryId, subcategoryId, brandId, variantTypeId, variantId });
        }}>
          {/* Images */}
          <div className="grid grid-cols-5 gap-2">
            {["Main Image", "Second Image", "Third Image", "Fourth Image", "Fifth Image"].map(
              (label, index) => (
                <label
                  key={label}
                  className="flex flex-col items-center justify-center border rounded-lg p-4 bg-muted/20 cursor-pointer hover:bg-muted"
                >
                  {images[index] ? (
                    <img
                      src={images[index]}
                      alt={label}
                      className="w-full h-20 object-cover rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{label}</span>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                  />
                </label>
              )
            )}
          </div>

          {/* Product Name */}
          <Input placeholder="Product Name" />

          {/* Product Description */}
          <Textarea placeholder="Product Description" />

          {/* Category Row */}
          <div className="grid grid-cols-3 gap-2">
            <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setSubcategoryId(""); setBrandId("") }}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
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

            <Select value={subcategoryId} onValueChange={(val) => { setSubcategoryId(val); setBrandId("") }}>
              <SelectTrigger><SelectValue placeholder="Sub Category" /></SelectTrigger>
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

            <Select value={brandId} onValueChange={setBrandId}>
              <SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger>
              <SelectContent>
                {brands.length === 0 ? (
                  <SelectItem value="__no_brands__" disabled>No brands found</SelectItem>
                ) : (
                  brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Price" />
            <Input placeholder="Offer Price" />
            <Input placeholder="Quantity" />
          </div>

          {/* Variant Row */}
          <div className="grid grid-cols-2 gap-2">
            <Select value={variantTypeId} onValueChange={(val) => { setVariantTypeId(val); setVariantId("") }}>
              <SelectTrigger><SelectValue placeholder="Select Variant Type" /></SelectTrigger>
              <SelectContent>
                {variantTypes.length === 0 ? (
                  <SelectItem value="__no_variant_types__" disabled>No variant types found</SelectItem>
                ) : (
                  variantTypes.map((vt) => (
                    <SelectItem key={vt.id} value={vt.id}>{vt.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select value={variantId} onValueChange={setVariantId}>
              <SelectTrigger><SelectValue placeholder="Select Variant" /></SelectTrigger>
              <SelectContent>
                {variants.length === 0 ? (
                  <SelectItem value="__no_variants__" disabled>No variants found</SelectItem>
                ) : (
                  variants.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </form>
        {/* FORM END */}

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit">Submit</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
