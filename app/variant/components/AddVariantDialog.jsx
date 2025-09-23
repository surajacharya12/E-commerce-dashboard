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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { storeApi } from "@/lib/utils"

export default function AddVariantDialog({ children }) {
  const [variantType, setVariantType] = useState("")
  const [variantName, setVariantName] = useState("")
  const variantTypes = storeApi.getAll().variantTypes

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    if (!variantType || !variantName) return
    storeApi.addVariant(variantType, variantName)
    // You would typically reset the form after a successful submission
  }

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            ADD VARIANT
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Select onValueChange={setVariantType} value={variantType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Variant Type" />
              </SelectTrigger>
              <SelectContent>
                {variantTypes.length === 0 ? (
                  <SelectItem value="__no_variant_types__" disabled>No variant types found</SelectItem>
                ) : (
                  variantTypes.map((vt) => (
                    <SelectItem key={vt.id} value={vt.id}>{vt.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Input
              placeholder="Variant Name"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
            />
          </div>
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}