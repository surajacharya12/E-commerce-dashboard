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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import {
  Store as StoreIcon,
  Building2,
  Building,
  ShoppingBag,
  ShoppingCart,
  Package,
  Warehouse,
} from "lucide-react"

// Store badge options using Lucide-React icons
const storeBadges = [
  { name: "Store", value: "Store", icon: StoreIcon },
  { name: "Building 2", value: "Building2", icon: Building2 },
  { name: "Building", value: "Building", icon: Building },
  { name: "Shopping Bag", value: "ShoppingBag", icon: ShoppingBag },
  { name: "Shopping Cart", value: "ShoppingCart", icon: ShoppingCart },
  { name: "Package", value: "Package", icon: Package },
  { name: "Warehouse", value: "Warehouse", icon: Warehouse },
]

// Predefined gradient color combinations in Tailwind format
const gradientOptions = [
  { name: 'Blue to Purple', value: 'from-blue-500 to-purple-600' },
  { name: 'Orange to Red', value: 'from-orange-500 to-red-600' },
  { name: 'Green to Teal', value: 'from-green-500 to-teal-600' },
  { name: 'Pink to Orange', value: 'from-pink-500 to-orange-400' },
  { name: 'Indigo to Blue', value: 'from-indigo-600 to-blue-500' },
  { name: 'Purple to Pink', value: 'from-purple-600 to-pink-500' },
  { name: 'Teal to Green', value: 'from-teal-500 to-green-600' },
  { name: 'Amber to Orange', value: 'from-amber-500 to-orange-600' },
];

export default function AddStoreDialog({ children, onAddStore, onEditStore, initialData }) {
  const [storeName, setStoreName] = useState("")
  const [storeManagerName, setStoreManagerName] = useState("")
  const [storeEmail, setStoreEmail] = useState("")
  const [storePhoneNumber, setStorePhoneNumber] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [storeLocation, setStoreLocation] = useState("")
  const [storeBadge, setStoreBadge] = useState("")
  const [storeManagerPhoto, setStoreManagerPhoto] = useState(null)
  const [gradientColor, setGradientColor] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState({}) // State to store validation errors

  useEffect(() => {
    if (initialData) {
      setStoreName(initialData.storeName || "")
      setStoreManagerName(initialData.storeManagerName || "")
      setStoreEmail(initialData.storeEmail || "")
      setStorePhoneNumber(initialData.storePhoneNumber || "")
      setStoreDescription(initialData.storeDescription || "")
      setStoreLocation(initialData.storeLocation || "")
      setStoreBadge(initialData.storeBadge || "")
      setStoreManagerPhoto(initialData.storeManagerPhoto || null)
      setGradientColor(initialData.gradientColor || "")
    } else {
      // Reset form when adding a new store
      setStoreName("")
      setStoreManagerName("")
      setStoreEmail("")
      setStorePhoneNumber("")
      setStoreDescription("")
      setStoreLocation("")
      setStoreBadge("")
      setStoreManagerPhoto(null)
      setGradientColor("")
    }
    setErrors({}); // Reset errors when dialog opens
  }, [initialData])

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStoreManagerPhoto(URL.createObjectURL(e.target.files[0]))
    }
  }

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits

    if (!storeName.trim()) {
      newErrors.storeName = "Store name is required.";
    }
    if (!storeManagerName.trim()) {
      newErrors.storeManagerName = "Manager name is required.";
    }
    if (!storeEmail.trim() || !emailRegex.test(storeEmail)) {
      newErrors.storeEmail = "A valid email address is required.";
    }
    if (!storePhoneNumber.trim() || !phoneRegex.test(storePhoneNumber)) {
      newErrors.storePhoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (!storeLocation.trim()) {
      newErrors.storeLocation = "Store location is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const storeData = {
      id: initialData?.id || Date.now(),
      storeName,
      storeManagerName,
      storeEmail,
      storePhoneNumber,
      storeDescription,
      storeLocation,
      storeBadge,
      storeManagerPhoto,
      gradientColor,
      date: new Date().toLocaleDateString(),
    }
    if (initialData) {
      onEditStore(storeData)
    } else {
      onAddStore(storeData)
    }
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT STORE" : "ADD STORE"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Store Name"
              value={storeName}
              onChange={(e) => {
                setStoreName(e.target.value);
                setErrors(prev => ({ ...prev, storeName: null }));
              }}
              className={errors.storeName ? "border-red-500" : ""}
            />
            {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
          </div>

          <div>
            <Input
              placeholder="Store Manager Name"
              value={storeManagerName}
              onChange={(e) => {
                setStoreManagerName(e.target.value);
                setErrors(prev => ({ ...prev, storeManagerName: null }));
              }}
              className={errors.storeManagerName ? "border-red-500" : ""}
            />
            {errors.storeManagerName && <p className="text-red-500 text-sm mt-1">{errors.storeManagerName}</p>}
          </div>

          <div>
            <Input
              placeholder="Store Email Address"
              type="email"
              value={storeEmail}
              onChange={(e) => {
                setStoreEmail(e.target.value);
                setErrors(prev => ({ ...prev, storeEmail: null }));
              }}
              className={errors.storeEmail ? "border-red-500" : ""}
            />
            {errors.storeEmail && <p className="text-red-500 text-sm mt-1">{errors.storeEmail}</p>}
          </div>

          <div>
            <Input
              placeholder="Store Phone Number"
              type="tel"
              value={storePhoneNumber}
              onChange={(e) => {
                setStorePhoneNumber(e.target.value);
                setErrors(prev => ({ ...prev, storePhoneNumber: null }));
              }}
              className={errors.storePhoneNumber ? "border-red-500" : ""}
            />
            {errors.storePhoneNumber && <p className="text-red-500 text-sm mt-1">{errors.storePhoneNumber}</p>}
          </div>

          <Textarea
            placeholder="Description"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
          />

          <div>
            <Input
              placeholder="Store Location"
              value={storeLocation}
              onChange={(e) => {
                setStoreLocation(e.target.value);
                setErrors(prev => ({ ...prev, storeLocation: null }));
              }}
              className={errors.storeLocation ? "border-red-500" : ""}
            />
            {errors.storeLocation && <p className="text-red-500 text-sm mt-1">{errors.storeLocation}</p>}
          </div>

          {/* Store Manager Photo Upload */}
          <div className="flex flex-col items-center justify-center border rounded-lg p-6 bg-muted/20 cursor-pointer hover:bg-muted relative">
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              {storeManagerPhoto ? (
                <img src={storeManagerPhoto} alt="Store Manager" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13V9a1 1 0 011-1h4a1 1 0 011 1v4m-2 4h-2m-2-2h4"
                    />
                  </svg>
                  <span className="mt-2 text-sm text-gray-500">Store Manager Photo</span>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Store Badge Dropdown with Lucide-React icons */}
          <Select onValueChange={setStoreBadge} value={storeBadge}>
            <SelectTrigger>
              <SelectValue placeholder="Store Badge (React Lucide)" />
            </SelectTrigger>
            <SelectContent>
              {storeBadges.map((badge) => (
                <SelectItem key={badge.value} value={badge.value}>
                  <div className="flex items-center gap-2">
                    <badge.icon className="h-4 w-4" />
                    <span>{badge.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Gradient Color Selection */}
          <div>
            <span className="text-sm font-medium text-gray-400">Gradient Colors (React/Tailwind Format)</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {gradientOptions.map((gradient) => (
                <div
                  key={gradient.value}
                  onClick={() => setGradientColor(gradient.value)}
                  className={`
                    w-12 h-12 rounded-lg cursor-pointer flex items-center justify-center
                    ${gradientColor === gradient.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                    bg-gradient-to-r ${gradient.value}
                  `}
                >
                  {gradientColor === gradient.value && (
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {initialData ? "Save Changes" : "Submit"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}