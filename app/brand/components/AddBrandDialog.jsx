"use client"

import { useState, useEffect } from "react"
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

export default function AddBrandDialog({ children, onAddBrand, onEditBrand, initialData, subcategories }) {
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setSelectedSubcategory(initialData.subcategoryId || "");
      setBrandName(initialData.name || "");
    } else {
      setSelectedSubcategory("");
      setBrandName("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedSubcategory) {
      newErrors.subcategory = "Please select a subcategory.";
    }
    if (!brandName.trim()) {
      newErrors.brandName = "Brand name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newBrand = {
      id: initialData?.id || Date.now(),
      subcategoryId: selectedSubcategory,
      name: brandName,
      date: initialData?.date || new Date().toISOString().split('T')[0],
    };

    if (initialData) {
      onEditBrand(newBrand);
    } else {
      onAddBrand(newBrand);
    }

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT BRAND" : "ADD BRAND"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select onValueChange={setSelectedSubcategory} value={selectedSubcategory}>
                <SelectTrigger className={errors.subcategory ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Sub Category" />
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
              {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
            </div>
            <div>
              <Input
                placeholder="Brand Name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className={errors.brandName ? "border-red-500" : ""}
              />
              {errors.brandName && <p className="text-red-500 text-sm mt-1">{errors.brandName}</p>}
            </div>
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