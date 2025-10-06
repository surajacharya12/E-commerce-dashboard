"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import url from "../../http/page";
import Image from "next/image"; // Import for displaying image preview

const API_URL = url + "categories";

export default function AddSubCategoryDialog({ children, onAddSubCategory, onEditSubCategory, initialData }) {
  const [categories, setCategories] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFile, setImageFile] = useState(null); // State for file object
  const [imagePreview, setImagePreview] = useState(""); // State for preview URL/path
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  // Effect to fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data);
        } else {
          throw new Error("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Effect to populate form for editing
  useEffect(() => {
    if (initialData) {
      setSubCategoryName(initialData.name || "");
      setSelectedCategory(initialData.categoryId?._id || "");
      // Use initialData.image for preview if it exists
      setImagePreview(initialData.image || ""); 
      setImageFile(null); // Clear image file when opening for edit
    } else {
      setSubCategoryName("");
      setSelectedCategory("");
      setImagePreview("");
      setImageFile(null);
    }
    setError("");
  }, [initialData, isOpen]);

  // Handle file change for image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview to base64 for new file
      };
      reader.readAsDataURL(file);
    } else {
      // If the user clears the file input, revert to the initial image or clear preview
      setImagePreview(initialData?.image || "");
    }
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subCategoryName.trim()) {
      setError("Sub-category name cannot be empty.");
      return;
    }
    if (!selectedCategory) {
      setError("Please select a parent category.");
      return;
    }

    if (!initialData && !imageFile) {
      // Only require image for new creation
      setError("Please select an image for the new sub-category.");
      return;
    }
      
    // Use FormData for file upload
    const formData = new FormData();
    formData.append("name", subCategoryName.trim());
    formData.append("categoryId", selectedCategory);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    
    // Check if we are editing and no new image is provided, but there was an initial image
    if (initialData && !imageFile && initialData.image) {
        // If you need to send the existing image URL to the server for a no-change scenario, 
        // you might need to adjust your backend to handle this or send a flag.
        // For standard file upload APIs, you usually omit the image field if no change is made.
        // We will stick to only sending the image if a new file is selected.
    }


    if (initialData) {
      onEditSubCategory(initialData._id, formData); // Pass formData for edit
    } else {
      onAddSubCategory(formData); // Pass formData for add
    }

    // setIsOpen(false); // Let the parent component close the dialog on success
    // setError("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT SUB-CATEGORY" : "ADD SUB-CATEGORY"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Sub-category Name Input */}
          <div>
            <Input
              placeholder="Sub-category Name"
              value={subCategoryName}
              onChange={(e) => {
                setSubCategoryName(e.target.value);
                if (error) setError("");
              }}
              className={error.includes("name") ? "border-red-500" : ""}
            />
          </div>

          {/* Parent Category Select */}
          <div>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Parent Category" />
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

          {/* Image Upload Input and Preview (REPLACED THE SECOND BLOCK) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sub-category Image</label>
            <Input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="file:text-white file:bg-purple-600 hover:file:bg-purple-700 cursor-pointer"
            />
            
            {/* Image Preview */}
            {(imagePreview || initialData?.image) && (
                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || initialData.image} // Use imagePreview first, fallback to initialData.image
                      alt="Image Preview"
                      className="w-full h-full object-cover"
                    />
                </div>
            )}

          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}
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