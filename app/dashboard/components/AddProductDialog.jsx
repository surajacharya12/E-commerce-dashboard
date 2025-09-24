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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { storeApi } from "@/lib/utils"

export default function AddProductDialog({ children, onAddProduct, onEditProduct, initialData }) {
  const [images, setImages] = useState(Array(5).fill(null));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [variantTypeId, setVariantTypeId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setOfferPrice(initialData.offerPrice || "");
      setQuantity(initialData.quantity || "");
      setCategoryId(initialData.categoryId || "");
      setSubcategoryId(initialData.subcategoryId || "");
      setBrandId(initialData.brandId || "");
      setVariantTypeId(initialData.variantTypeId || "");
      setVariantId(initialData.variantId || "");
      setImages(initialData.images || Array(5).fill(null));
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setOfferPrice("");
      setQuantity("");
      setCategoryId("");
      setSubcategoryId("");
      setBrandId("");
      setVariantTypeId("");
      setVariantId("");
      setImages(Array(5).fill(null));
    }
  }, [initialData]);

  const data = storeApi.getAll();
  const categories = data.categories;
  const subcategories = data.subcategories.filter((s) => !categoryId || s.categoryId === categoryId);
  const brands = data.brands.filter((b) => !subcategoryId || b.subcategoryId === subcategoryId);
  const variantTypes = data.variantTypes;
  const variants = data.variants.filter((v) => !variantTypeId || v.variantTypeId === variantTypeId);

  const handleImageChange = (index, file) => {
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!categoryId) newErrors.categoryId = "Category is required.";
    if (!subcategoryId) newErrors.subcategoryId = "Subcategory is required.";
    if (!brandId) newErrors.brandId = "Brand is required.";
    if (price.trim() === "" || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = "Price must be a valid positive number.";
    }
    if (offerPrice.trim() !== "" && (isNaN(parseFloat(offerPrice)) || parseFloat(offerPrice) < 0)) {
      newErrors.offerPrice = "Offer price must be a valid positive number.";
    }
    if (quantity.trim() === "" || !Number.isInteger(parseFloat(quantity)) || parseInt(quantity) < 0) {
      newErrors.quantity = "Quantity must be a valid positive integer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      id: initialData?.id || Date.now(),
      name,
      description,
      price: parseFloat(price),
      offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
      quantity: parseInt(quantity),
      categoryId,
      subcategoryId,
      brandId,
      variantTypeId,
      variantId,
      images,
      date: initialData?.date || new Date().toISOString().split('T')[0],
    };

    if (initialData) {
      onEditProduct(productData);
    } else {
      onAddProduct(productData);
    }

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT PRODUCT" : "ADD PRODUCT"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {initialData ? "Update the product details below." : "Fill out the details below to add a new product."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          <div>
            <Input
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          {/* Product Description */}
          <Textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          {/* Category Row */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setSubcategoryId(""); setBrandId("") }}>
                <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}><SelectValue placeholder="Select Category" /></SelectTrigger>
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
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>
            <div>
              <Select value={subcategoryId} onValueChange={(val) => { setSubcategoryId(val); setBrandId("") }}>
                <SelectTrigger className={errors.subcategoryId ? "border-red-500" : ""}><SelectValue placeholder="Sub Category" /></SelectTrigger>
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
              {errors.subcategoryId && <p className="text-red-500 text-sm mt-1">{errors.subcategoryId}</p>}
            </div>
            <div>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger className={errors.brandId ? "border-red-500" : ""}><SelectValue placeholder="Select Brand" /></SelectTrigger>
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
              {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
            </div>
          </div>
          {/* Price Row */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Input
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.01"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <Input
                placeholder="Offer Price"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                type="number"
                step="0.01"
                className={errors.offerPrice ? "border-red-500" : ""}
              />
              {errors.offerPrice && <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>}
            </div>
            <div>
              <Input
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                step="1"
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
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
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
            >
              {initialData ? "Save Changes" : "Submit"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}