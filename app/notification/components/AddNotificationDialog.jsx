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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function NotificationDialog({ open, mode, notification, onAction, onClose }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sendPush, setSendPush] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (mode === 'edit' && notification) {
      setTitle(notification.title)
      setDescription(notification.description)
      setPreview(notification.imageUrl)
      setSendPush(false)
    } else {
      setTitle("")
      setDescription("")
      setPreview(null)
      setImageFile(null)
      setSendPush(false)
    }
  }, [mode, notification, open])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("sendPush", sendPush)
    if (imageFile) {
      formData.append("img", imageFile)
    }
    onAction(formData)
  }

  const dialogTitle = mode === 'edit' ? "Edit Notification" : "Add Notification";
  const actionButtonText = mode === 'edit' ? "Save" : "Create";

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {dialogTitle}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input placeholder="Notification Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          
          <div className="flex flex-col items-center justify-center border rounded-lg p-6 bg-muted/20 cursor-pointer hover:bg-muted relative">
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13V9a1 1 0 011-1h4a1 1 0 011 1v4m-2 4h-2m-2-2h4" />
                  </svg>
                  <span className="mt-2 text-sm">Click to select image (optional)</span>
                </div>
              )}
              <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="push" checked={sendPush} onCheckedChange={setSendPush} />
            <Label htmlFor="push">Send push notification</Label>
          </div>
        </form>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" onClick={handleSubmit}>{actionButtonText}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}