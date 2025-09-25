"use client"

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

const API_URL = url + "categories";

export default function AddSubCategoryDialog({ children, onAddSubCategory, onEditSubCategory, initialData }) {
  const [categories, setCategories] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (initialData) {
      setSubCategoryName(initialData.name || "");
      setSelectedCategory(initialData.categoryId?._id || "");
    } else {
      setSubCategoryName("");
      setSelectedCategory("");
    }
    setError("");
  }, [initialData, isOpen]);

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

    if (initialData) {
      onEditSubCategory(initialData._id, subCategoryName, selectedCategory);
    } else {
      onAddSubCategory(subCategoryName, selectedCategory);
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
            {initialData ? "EDIT SUB-CATEGORY" : "ADD SUB-CATEGORY"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Sub-category Name"
              value={subCategoryName}
              onChange={(e) => {
                setSubCategoryName(e.target.value);
                if (error) setError("");
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
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