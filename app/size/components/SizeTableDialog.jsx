"use client"

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component

export default function SizeTableDialog({ children, onAddSize, onEditSize, initialData }) {
  const [sizeName, setSizeName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setSizeName(initialData.name || "");
      setDescription(initialData.description || "");
    } else {
      setSizeName("");
      setDescription("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!sizeName.trim()) {
      newErrors.sizeName = "Size Name is required.";
    } else if (sizeName.trim().length < 1) { // Added length validation for name
      newErrors.sizeName = "Size Name must be at least 1 character long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const data = {
      name: sizeName,
      description: description,
    };

    if (initialData) {
      onEditSize({ ...data, id: initialData._id });
    } else {
      onAddSize(data);
    }

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT SIZE" : "ADD SIZE"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Size Name (e.g., S, M, L, XL, 32, 34)"
              value={sizeName}
              onChange={(e) => setSizeName(e.target.value)}
              className={errors.sizeName ? "border-red-500" : ""}
            />
            {errors.sizeName && <p className="text-red-500 text-sm mt-1">{errors.sizeName}</p>}
          </div>
          <div>
            <Textarea // Using Textarea for description
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" onClick={handleSubmit}>
                {initialData ? "Save Changes" : "Submit"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}