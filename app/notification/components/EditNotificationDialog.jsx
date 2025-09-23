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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditNotificationDialog({ notification, onUpdate, onClose }) {
  const [title, setTitle] = useState(notification.title)
  const [description, setDescription] = useState(notification.description)
  const [sendPush, setSendPush] = useState(notification.sendPushNotification || false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(notification.image || null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("sendPushNotification", sendPush)
    if (image) formData.append("image", image)

    await onUpdate(notification.id, formData)
  }

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">Edit Notification</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          {preview && (
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
          )}
          <Input type="file" accept="image/*" onChange={handleImageChange} />

          <div className="flex items-center space-x-2">
            <Checkbox id="edit-push" checked={sendPush} onCheckedChange={setSendPush} />
            <Label htmlFor="edit-push">Send push notification</Label>
          </div>
        </form>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" onClick={handleSubmit}>Save</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
