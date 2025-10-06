"use client";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function NotificationDialog({
  open,
  mode,
  notification,
  onAction,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sendPush, setSendPush] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (mode === "edit" && notification) {
        setTitle(notification.title);
        setDescription(notification.description);
        setPreview(notification.imageUrl);
        setSendPush(false);
        setImageFile(null);
      } else {
        setTitle("");
        setDescription("");
        setPreview(null);
        setImageFile(null);
        setSendPush(false);
      }
      setErrors({});
    }
  }, [mode, notification, open]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      if (errors.imageFile) {
        setErrors((prevErrors) => ({ ...prevErrors, imageFile: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Notification title is required.";
    if (!description.trim())
      newErrors.description = "Notification description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("sendPush", sendPush);
    if (imageFile) {
      formData.append("img", imageFile);
    }

    if (onAction) {
      onAction(formData, mode, notification?._id);
    } else {
      console.error("onAction is missing in NotificationDialog props");
    }
  };

  const dialogTitle = mode === "edit" ? "Edit Notification" : "Add Notification";
  const actionButtonText = mode === "edit" ? "Save" : "Create";

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {dialogTitle}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Notification Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div
            className={`flex flex-col items-center justify-center border rounded-lg p-6 bg-muted/20 cursor-pointer hover:bg-muted relative ${errors.imageFile ? "border-red-500" : ""
              }`}
          >
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
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
                  <span className="mt-2 text-sm">
                    Click to select image (optional)
                  </span>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {errors.imageFile && (
              <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="push"
              checked={sendPush}
              onCheckedChange={setSendPush}
            />
            <Label htmlFor="push">Send push notification</Label>
          </div>
        </form>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {actionButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}