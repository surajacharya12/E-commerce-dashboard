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
import { storeApi } from "@/lib/utils"

export default function VariantTypeTableDialog({ children }) {
  const [variantName, setVariantName] = useState("")
  const [variantType, setVariantType] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    storeApi.addVariantType(variantType || variantName)
    setVariantName("")
    setVariantType("")
  }

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            ADD VARIANT TYPE
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Variant Name"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
            />
            <Input
              placeholder="Variant Type"
              value={variantType}
              onChange={(e) => setVariantType(e.target.value)}
            />
          </div>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit">
                Submit
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}