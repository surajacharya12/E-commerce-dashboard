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
import { toast } from "react-hot-toast";

export default function AddBrandDialog({ children, onAddBrand, onEditBrand, initialData, subcategories }) {
    const [selectedSubcategory, setSelectedSubcategory] = useState("")
    const [brandName, setBrandName] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setSelectedSubcategory(initialData.subcategoryId?._id || "");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const brandData = {
            name: brandName,
            subcategoryId: selectedSubcategory,
        };

        if (initialData) {
            await onEditBrand({ ...brandData, _id: initialData._id });
        } else {
            await onAddBrand(brandData);
        }

        setIsOpen(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            {children}
            <AlertDialogContent className="max-w-md bg-[#2a2f45] border border-gray-700 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-xl font-semibold">
                        {initialData ? "EDIT BRAND" : "ADD BRAND"}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Select onValueChange={setSelectedSubcategory} value={selectedSubcategory}>
                                <SelectTrigger className={errors.subcategory ? "border-red-500 bg-[#1e2235] text-white" : "bg-[#1e2235] text-white"}>
                                    <SelectValue placeholder="Select Sub Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e2235] text-white border border-gray-700">
                                    {subcategories.length === 0 ? (
                                        <SelectItem value="__no_subcategories__" disabled className="text-gray-400">No subcategories found</SelectItem>
                                    ) : (
                                        subcategories.map((s) => (
                                            <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
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
                                className={errors.brandName ? "border-red-500 bg-[#1e2235] text-white" : "bg-[#1e2235] text-white"}
                            />
                            {errors.brandName && <p className="text-red-500 text-sm mt-1">{errors.brandName}</p>}
                        </div>
                    </div>
                </form>

                <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel onClick={() => setIsOpen(false)} className="bg-gray-600 hover:bg-gray-700 text-white border-none">Cancel</AlertDialogCancel>
                    <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white">
                        {initialData ? "Save Changes" : "Submit"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
