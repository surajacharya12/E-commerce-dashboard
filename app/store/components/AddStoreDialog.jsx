"use client"

import { useState } from "react"
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
  Store,
  Building2,
  Building,
  ShoppingBag,
  ShoppingCart,
  Package,
  Warehouse,
} from "lucide-react"

export default function AddStoreDialog({ children }) {
  const [storeName, setStoreName] = useState("")
  const [storeManagerName, setStoreManagerName] = useState("")
  const [storeEmail, setStoreEmail] = useState("")
  const [storePhoneNumber, setStorePhoneNumber] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [storeLocation, setStoreLocation] = useState("")
  const [storeBadge, setStoreBadge] = useState("")
  const [storeManagerPhoto, setStoreManagerPhoto] = useState(null)
  const [gradientColor, setGradientColor] = useState("")

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStoreManagerPhoto(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log({
      storeName,
      storeManagerName,
      storeEmail,
      storePhoneNumber,
      storeDescription,
      storeLocation,
      storeBadge,
      storeManagerPhoto,
      gradientColor,
    })
    // Reset form fields after submission
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

  // Store badge options using Lucide-React icons
  const storeBadges = [
    { name: "Store", value: "Store", icon: Store },
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

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            ADD STORE
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <Input
            placeholder="Store Manager Name"
            value={storeManagerName}
            onChange={(e) => setStoreManagerName(e.target.value)}
          />
          <Input
            placeholder="Store Email Address"
            type="email"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
          />
          <Input
            placeholder="Store Phone Number"
            type="tel"
            value={storePhoneNumber}
            onChange={(e) => setStorePhoneNumber(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
          />
          <Input
            placeholder="Store Location"
            value={storeLocation}
            onChange={(e) => setStoreLocation(e.target.value)}
          />

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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}