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

export default function AddColorDialog({ children, onAddColor, onEditColor, initialData }) {
  const [colorName, setColorName] = useState("")
  const [hexCode, setHexCode] = useState("")
  const [category, setCategory] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState({})

  // Convert color name to hex
  const nameToHex = (colorName) => {
    try {
      const ctx = document.createElement("canvas").getContext("2d")
      ctx.fillStyle = colorName.trim()
      const color = ctx.fillStyle
      return color.startsWith("#") ? color.toUpperCase() : null
    } catch {
      return null
    }
  }

  // Initialize form when dialog opens or editing existing color
  useEffect(() => {
    if (initialData) {
      setColorName(initialData.name || "")
      setHexCode(initialData.hexCode || "")
      setCategory(initialData.category || "")
    } else {
      setColorName("")
      setHexCode("")
      setCategory("")
    }
    setErrors({})
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Step 1: Determine final hex code
    let finalHex = hexCode.trim()

    // If hex is invalid or empty, try to convert color name
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(finalHex) && colorName.trim()) {
      const derived = nameToHex(colorName.trim())
      if (derived) finalHex = derived
    }

    // Step 2: Validate all fields
    const newErrors = {}
    if (!colorName.trim()) newErrors.colorName = "Color name is required."
    if (!category.trim()) newErrors.category = "Category is required."
    if (!finalHex || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(finalHex)) {
      newErrors.hexCode = "Please enter a valid hex code or recognized color name."
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // Step 3: Send to backend
    const data = {
      name: colorName.trim(),
      hexCode: finalHex,
      category: category.trim(),
    }

    if (initialData) {
      onEditColor(initialData._id, data)
    } else {
      onAddColor(data)
    }

    // Update UI and close dialog
    setHexCode(finalHex)
    setIsOpen(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT COLOR" : "ADD COLOR"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Input
                placeholder="Color Name (e.g., Red)"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                className={errors.colorName ? "border-red-500" : ""}
              />
              {errors.colorName && (
                <p className="text-red-500 text-sm mt-1">{errors.colorName}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Hex Code (e.g., #FF00FF)"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                className={errors.hexCode ? "border-red-500" : ""}
              />
              {errors.hexCode && (
                <p className="text-red-500 text-sm mt-1">{errors.hexCode}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Category (e.g., Primary, Pastel)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={errors.category ? "border-red-500" : ""}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" onClick={handleSubmit}>
              {initialData ? "Save Changes" : "Submit"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
