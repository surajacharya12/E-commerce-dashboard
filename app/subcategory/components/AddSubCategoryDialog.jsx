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

export default function AddSubCategoryDialog({ children, onAddSubCategory, onEditSubCategory, initialData, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [subCategoryName, setSubCategoryName] = useState("")
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setSelectedCategory(initialData.categoryId || "");
      setSubCategoryName(initialData.name || "");
    } else {
      setSelectedCategory("");
      setSubCategoryName("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedCategory) {
      newErrors.category = "Please select a category.";
    }
    if (!subCategoryName.trim()) {
      newErrors.name = "Sub category name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newSubCategory = {
      id: initialData?.id || Date.now(),
      categoryId: selectedCategory,
      name: subCategoryName,
      date: initialData?.date || new Date().toISOString().split('T')[0],
    };

    if (initialData) {
      onEditSubCategory(newSubCategory);
    } else {
      onAddSubCategory(newSubCategory);
    }

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT SUB CATEGORY" : "ADD SUB CATEGORY"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
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
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <Input
                placeholder="Sub Category Name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
  )
}