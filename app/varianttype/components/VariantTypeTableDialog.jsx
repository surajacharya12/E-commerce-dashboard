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

export default function VariantTypeTableDialog({ children, onAddVariant, onEditVariant, initialData }) {
  const [variantName, setVariantName] = useState("");
  const [variantType, setVariantType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setVariantName(initialData.name || "");
      setVariantType(initialData.type || "");
    } else {
      setVariantName("");
      setVariantType("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!variantName.trim()) {
      newErrors.variantName = "Variant Name is required.";
    }
    if (!variantType.trim()) {
      newErrors.variantType = "Variant Type is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newVariant = {
      id: initialData?.id || Date.now(),
      name: variantName,
      type: variantType,
      date: initialData?.date || new Date().toISOString().split('T')[0],
    };

    if (initialData) {
      onEditVariant(newVariant);
    } else {
      onAddVariant(newVariant);
    }

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT VARIANT TYPE" : "ADD VARIANT TYPE"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Variant Name"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className={errors.variantName ? "border-red-500" : ""}
              />
              {errors.variantName && <p className="text-red-500 text-sm mt-1">{errors.variantName}</p>}
            </div>
            <div>
              <Input
                placeholder="Variant Type"
                value={variantType}
                onChange={(e) => setVariantType(e.target.value)}
                className={errors.variantType ? "border-red-500" : ""}
              />
              {errors.variantType && <p className="text-red-500 text-sm mt-1">{errors.variantType}</p>}
            </div>
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