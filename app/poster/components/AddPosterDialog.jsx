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
import { toast } from "sonner";

export default function AddPosterDialog({ children, onAddPoster, onEditPoster, initialData }) {
  const [posterFile, setPosterFile] = useState(null);
  const [posterImagePreview, setPosterImagePreview] = useState(null);
  const [posterName, setPosterName] = useState("");
  const [subText, setSubText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setPosterName(initialData.posterName || "");
      setSubText(initialData.subText || "");
      setPosterImagePreview(initialData.imageUrl || null);
      setPosterFile(null);
    } else {
      setPosterName("");
      setSubText("");
      setPosterImagePreview(null);
      setPosterFile(null);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPosterFile(file);
      setPosterImagePreview(URL.createObjectURL(file));
    }
    if (errors.posterImage) {
      setErrors((prevErrors) => ({ ...prevErrors, posterImage: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!posterName.trim()) {
      newErrors.posterName = "Poster name is required.";
    }
    if (!posterFile && !initialData?.imageUrl) {
      newErrors.posterImage = "A poster image is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const posterData = { posterName, subText, posterFile };
    let response;
    if (initialData) {
      posterData._id = initialData._id;
      response = await onEditPoster(posterData);
    } else {
      response = await onAddPoster(posterData);
    }

    if (response.success) {
      toast.success(response.message);
      setIsOpen(false);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT POSTER" : "ADD POSTER"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Image Upload */}
          <div className={`flex flex-col items-center justify-center border rounded-lg p-12 bg-muted/20 cursor-pointer hover:bg-muted relative ${errors.posterImage ? "border-red-500" : ""}`}>
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              {posterImagePreview ? (
                <img src={posterImagePreview} alt="Poster" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13V9a1 1 0 011-1h4a1 1 0 011 1v4m-2 4h-2m-2-2h4" />
                  </svg>
                  <span className="mt-2 text-sm text-gray-500">Tap to select image</span>
                </div>
              )}
              <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {errors.posterImage && <p className="text-red-500 text-sm mt-1">{errors.posterImage}</p>}
          </div>

          {/* Poster Name */}
          <div>
            <Input placeholder="Poster Name" value={posterName} onChange={(e) => setPosterName(e.target.value)} className={errors.posterName ? "border-red-500" : ""} />
            {errors.posterName && <p className="text-red-500 text-sm mt-1">{errors.posterName}</p>}
          </div>

          {/* SubText */}
          <div>
            <Input placeholder="Subtext (e.g., 50% OFF)" value={subText} onChange={(e) => setSubText(e.target.value)} />
          </div>
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
              {initialData ? "Save Changes" : "Create"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
