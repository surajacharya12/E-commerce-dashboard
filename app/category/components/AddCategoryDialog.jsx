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

export default function AddCategoryDialog({ children, onAddCategory, onEditCategory, initialData }) {
  const [image, setImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setImage(initialData.image || null);
      setCategoryName(initialData.name || "");
    } else {
      setImage(null);
      setCategoryName("");
    }
    setError("");
  }, [initialData, isOpen]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    
    // Optional: Add image validation if it's required
    // if (!image) {
    //   setError("Category image is required.");
    //   return;
    // }

    const newCategory = {
      id: initialData?.id || Date.now(),
      name: categoryName,
      image: image,
      date: initialData?.date || new Date().toISOString().split('T')[0],
    };

    if (initialData) {
      onEditCategory(newCategory);
    } else {
      onAddCategory(newCategory);
    }

    setIsOpen(false);
    setError("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT CATEGORY" : "ADD CATEGORY"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer bg-muted/20 hover:bg-muted">
            {image ? (
              <img
                src={image}
                alt="Category Preview"
                className="w-full h-auto object-cover rounded"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="mt-2 text-sm">Tap to select image</span>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <Input
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (error) setError("");
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </form>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
            >
              {initialData ? "Save Changes" : "Create"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}