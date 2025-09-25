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

export default function AddVariantDialog({ children, onAddVariant, onEditVariant, initialData, variantTypes, fetchVariants }) {
  const [variantType, setVariantType] = useState("");
  const [variantName, setVariantName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setVariantType(initialData.variantTypeId?._id || "");
      setVariantName(initialData.name || "");
    } else {
      setVariantType("");
      setVariantName("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!variantType) {
      newErrors.variantType = "Please select a variant type.";
    }
    if (!variantName.trim()) {
      newErrors.variantName = "Variant name is required.";
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
      variantTypeId: variantType,
      name: variantName,
    };

    if (initialData) {
      onEditVariant(initialData._id, data);
    } else {
      onAddVariant(data);
    }
    
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT VARIANT" : "ADD VARIANT"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select onValueChange={setVariantType} value={variantType}>
                <SelectTrigger className={errors.variantType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Variant Type" />
                </SelectTrigger>
                <SelectContent>
                  {variantTypes.length === 0 ? (
                    <SelectItem value="__no_variant_types__" disabled>No variant types found</SelectItem>
                  ) : (
                    variantTypes.map((vt) => (
                      <SelectItem key={vt._id} value={vt._id}>{vt.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.variantType && <p className="text-red-500 text-sm mt-1">{errors.variantType}</p>}
            </div>
            <div>
              <Input
                placeholder="Variant Name"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className={errors.variantName ? "border-red-500" : ""}
              />
              {errors.variantName && <p className="text-red-500 text-sm mt-1">{errors.variantName}</p>}
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