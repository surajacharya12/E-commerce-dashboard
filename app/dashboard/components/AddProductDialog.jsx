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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function AddProductDialog({
  children,
  onAddProduct,
  onEditProduct,
  initialData,
  categories = [],
  subcategories = [],
  brands = [],
  variantTypes = [],
  variants = [],
  setEditingProduct,
}) {
  // Maintain previews and actual File objects separately
  const [imagePreviews, setImagePreviews] = useState(Array(5).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(5).fill(null));
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
  const [adminRating, setAdminRating] = useState("");
  const [pointsText, setPointsText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price ?? "");
      setOfferPrice(initialData.offerPrice ?? "");
      setQuantity(initialData.stock?.toString() || initialData.quantity?.toString() || "");
      setAdminRating(initialData.rating?.adminRating?.toString() || "");
  setPointsText(Array.isArray(initialData.points) ? initialData.points.join('\n') : (initialData.points || ""));

      // Use initialData for dropdowns, safely accessing _id from populated objects
      setCategoryId(initialData.proCategoryId?._id || "");
      setSubcategoryId(initialData.proSubCategoryId?._id || "");
      setBrandId(initialData.proBrandId?._id || "");
      setVariantTypeId(initialData.proVariantTypeId?._id || "");
      // Assuming variantId holds a single selected variant's ID
      setVariantId(Array.isArray(initialData.proVariantId) && initialData.proVariantId.length > 0 ? initialData.proVariantId[0]?._id : "");

      // If initialData.images contains URLs, use them as previews
      if (initialData.images && Array.isArray(initialData.images)) {
        const previews = Array(5).fill(null);
        initialData.images.slice(0, 5).forEach((imgObj, idx) => {
          previews[idx] = imgObj.url; // Assuming image object has a 'url' property
        });
        setImagePreviews(previews);
      } else {
        setImagePreviews(Array(5).fill(null));
      }
      setImageFiles(Array(5).fill(null)); // Clear actual files when editing, new files will overwrite
    } else {
      // Reset all states when dialog opens for a new product
      setName("");
      setDescription("");
      setPrice("");
      setOfferPrice("");
      setQuantity("");
      setAdminRating("");
      setCategoryId("");
      setSubcategoryId("");
      setBrandId("");
      setVariantTypeId("");
      setVariantId("");
      setImagePreviews(Array(5).fill(null));
      setImageFiles(Array(5).fill(null));
      setPointsText("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const allSubcategories = subcategories;
  const allBrands = brands;
  const allVariants = variants;

  const handleImageChange = (index, file) => {
    if (!file) return;
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!categoryId) newErrors.categoryId = "Category is required.";
    if (!subcategoryId) newErrors.subcategoryId = "Subcategory is required.";
    if (!brandId) newErrors.brandId = "Brand is required.";
    if (price === "" || isNaN(parseFloat(price)) || parseFloat(price) < 0) newErrors.price = "Price must be a valid positive number.";
    if (offerPrice !== "" && (isNaN(parseFloat(offerPrice)) || parseFloat(offerPrice) < 0)) newErrors.offerPrice = "Offer price must be valid.";
    if (quantity === "" || !Number.isInteger(Number(quantity)) || parseInt(quantity) < 0) newErrors.quantity = "Quantity must be a valid non-negative integer.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    const fd = new FormData();

    fd.append("name", name);
    fd.append("description", description);
    fd.append("price", price);
    if (offerPrice !== "") fd.append("offerPrice", offerPrice);
    fd.append("quantity", quantity);
    fd.append("stock", quantity); // Use same value for stock
    if (adminRating !== "") fd.append("adminRating", adminRating);

  // Append points as JSON string (backend accepts JSON string or newline-separated)
  const pointsArray = pointsText.split('\n').map(p => p.trim()).filter(Boolean);
  if (pointsArray.length > 0) fd.append('points', JSON.stringify(pointsArray));

    if (categoryId) fd.append("proCategoryId", categoryId);
    if (subcategoryId) fd.append("proSubCategoryId", subcategoryId);
    if (brandId) fd.append("proBrandId", brandId);
    if (variantTypeId) fd.append("proVariantTypeId", variantTypeId);
    // proVariantId should be an array on the backend, but select sends a single string.
    // Backend will handle conversion or array wrapper.
    if (variantId) fd.append("proVariantId", variantId);

    imageFiles.forEach((file, idx) => {
      if (file) {
        fd.append(`image${idx + 1}`, file); // Backend expects image1, image2 etc.
      }
    });

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = buildPayload();

    try {
      if (initialData && (initialData.id || initialData._id)) {
        const id = initialData.id || initialData._id;
        if (typeof onEditProduct === "function") {
          await onEditProduct(id, payload);
        }
      } else {
        if (typeof onAddProduct === "function") {
          await onAddProduct(payload);
        }
      }
      setIsOpen(false);
      if (typeof setEditingProduct === "function") setEditingProduct(null);
    } catch (error) {
      console.error("Error submitting product form:", error);
      alert("Failed to save product. Please try again.");
    }
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
            {["Main Image", "Second Image", "Third Image", "Fourth Image", "Fifth Image"].map((label, index) => (
              <label key={label} className="flex flex-col items-center justify-center border rounded-lg p-4 bg-muted/20 cursor-pointer hover:bg-muted">
                {imagePreviews[index] ? (
                  <img src={imagePreviews[index]} alt={label} className="w-full h-20 object-cover rounded" />
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
            ))}
          </div>

          {/* Name */}
          <div>
            <Input
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <Textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />

          {/* Product Highlights / Points - dedicated box */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Highlights (one per line)</label>
            <Textarea
              placeholder="Enter each highlight on a new line, e.g.\nFast charging battery\n2 year warranty"
              value={pointsText}
              onChange={(e) => setPointsText(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">Enter one highlight per line. These will appear in the product description area.</p>
          </div>

          {/* Category / Subcategory / Brand */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Select
                value={categoryId}
                onValueChange={(val) => {
                  setCategoryId(val);
                  setSubcategoryId(""); // Reset subcategory when category changes
                  setBrandId("");       // Reset brand when category changes
                }}
              >
                <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <SelectItem value="__no_categories__" disabled>No categories found</SelectItem>
                  ) : (
                    categories.map((c) => <SelectItem key={c.id || c._id} value={c.id || c._id}>{c.name}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <Select
                value={subcategoryId}
                onValueChange={(val) => {
                  setSubcategoryId(val);
                  setBrandId("");       // Reset brand when subcategory changes
                }}
              >
                <SelectTrigger className={errors.subcategoryId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  {allSubcategories.length === 0 ? (
                    <SelectItem value="__no_subcategories__" disabled>No subcategories found</SelectItem>
                  ) : (
                    allSubcategories.map((s) => <SelectItem key={s.id || s._id} value={s.id || s._id}>{s.name}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
              {errors.subcategoryId && <p className="text-red-500 text-sm mt-1">{errors.subcategoryId}</p>}
            </div>

            <div>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger className={errors.brandId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {allBrands.length === 0 ? (
                    <SelectItem value="__no_brands__" disabled>No brands found</SelectItem>
                  ) : (
                    allBrands.map((b) => <SelectItem key={b.id || b._id} value={b.id || b._id}>{b.name}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
              {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
            </div>
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-4 gap-2">
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
            <div>
              <Input
                placeholder="Admin Rating (1-5)"
                value={adminRating}
                onChange={(e) => setAdminRating(e.target.value)}
                type="number"
                step="0.1"
                min="0"
                max="5"
              />
            </div>
          </div>

          {/* Variant Row */}
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={variantTypeId}
              onValueChange={(val) => {
                setVariantTypeId(val);
                setVariantId("");     // Reset variant when variant type changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Variant Type" />
              </SelectTrigger>
              <SelectContent>
                {variantTypes.length === 0 ? (
                  <SelectItem value="__no_variant_types__" disabled>No variant types found</SelectItem>
                ) : (
                  variantTypes.map((vt) => <SelectItem key={vt.id || vt._id} value={vt.id || vt._id}>{vt.name}</SelectItem>)
                )}
              </SelectContent>
            </Select>

            <Select value={variantId} onValueChange={setVariantId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Variant" />
              </SelectTrigger>
              <SelectContent>
                {allVariants.length === 0 ? (
                  <SelectItem value="__no_variants__" disabled>No variants found</SelectItem>
                ) : (
                  allVariants.map((v) => <SelectItem key={v.id || v._id} value={v.id || v._id}>{v.name}</SelectItem>)
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