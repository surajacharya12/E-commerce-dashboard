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

export default function AddPosterDialog({ children }) {
  const [posterImage, setPosterImage] = useState(null)
  const [posterName, setPosterName] = useState("")

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPosterImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Poster Name:", posterName)
    console.log("Poster Image:", posterImage)
    // You would typically reset the form after a successful submission
    setPosterImage(null)
    setPosterName("")
  }

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            ADD POSTER
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Image Upload Area */}
          <div className="flex flex-col items-center justify-center border rounded-lg p-12 bg-muted/20 cursor-pointer hover:bg-muted relative">
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              {posterImage ? (
                <img src={posterImage} alt="Poster" className="w-full h-full object-cover rounded" />
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
                  <span className="mt-2 text-sm text-gray-500">Tap to select image</span>
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

          {/* Poster Name */}
          <Input
            placeholder="Poster Name"
            value={posterName}
            onChange={(e) => setPosterName(e.target.value)}
          />
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}