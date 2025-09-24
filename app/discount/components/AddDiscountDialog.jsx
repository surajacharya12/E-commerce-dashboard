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
import { MdShoppingCart, MdCategory, MdInventory, MdStore, MdLocalMall, MdShoppingBag, MdStorefront, MdBusiness, MdLocalOffer, MdDiscount, MdPercent, MdSell, MdPriceChange, MdMonetizationOn, MdAttachMoney, MdSavings, MdFlashOn, MdStar, MdFavorite, MdThumbUp, MdCelebration, MdCardGiftcard, MdRedeem, MdLoyalty, MdHelpOutline } from "react-icons/md";

// Icon mapping to connect string names to React components
const iconMap = {
  'shopping_cart': MdShoppingCart, 'category': MdCategory, 'inventory': MdInventory,
  'store': MdStore, 'local_mall': MdLocalMall, 'shopping_bag': MdShoppingBag,
  'storefront': MdStorefront, 'business': MdBusiness, 'local_offer': MdLocalOffer,
  'discount': MdDiscount, 'percent': MdPercent, 'sell': MdSell,
  'price_change': MdPriceChange, 'monetization_on': MdMonetizationOn,
  'attach_money': MdAttachMoney, 'savings': MdSavings, 'flash_on': MdFlashOn,
  'star': MdStar, 'favorite': MdFavorite, 'thumb_up': MdThumbUp,
  'celebration': MdCelebration, 'card_giftcard': MdCardGiftcard,
  'redeem': MdRedeem, 'loyalty': MdLoyalty, 'help_outline': MdHelpOutline,
};

const _categoryIcons = Object.keys(iconMap).slice(0, 8);
const _discountIcons = Object.keys(iconMap).slice(8, 16);
const _dealIcons = Object.keys(iconMap).slice(16, 24);

export default function AddDiscountDialog({ children, onAddDiscount, onEditDiscount, initialData }) {
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [description, setDescription] = useState("");
  const [discountName, setDiscountName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [discountPhoto, setDiscountPhoto] = useState(null);
  const [discountIcon, setDiscountIcon] = useState("");
  const [dealIcon, setDealIcon] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setDiscountPercentage(initialData.discountPercentage || "");
      setDescription(initialData.description || "");
      setDiscountName(initialData.discountName || "");
      setCategoryIcon(initialData.categoryIcon || "");
      setDiscountPhoto(initialData.discountPhoto || null);
      setDiscountIcon(initialData.discountIcon || "");
      setDealIcon(initialData.dealIcon || "");
    } else {
      setDiscountPercentage("");
      setDescription("");
      setDiscountName("");
      setCategoryIcon("");
      setDiscountPhoto(null);
      setDiscountIcon("");
      setDealIcon("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDiscountPhoto(URL.createObjectURL(e.target.files[0]));
    }
    if (errors.discountPhoto) {
      setErrors((prevErrors) => ({ ...prevErrors, discountPhoto: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!discountName.trim()) {
      newErrors.discountName = "Discount Name is required.";
    }
    if (!discountPercentage.trim() || isNaN(parseFloat(discountPercentage)) || parseFloat(discountPercentage) < 0 || parseFloat(discountPercentage) > 100) {
      newErrors.discountPercentage = "Please enter a valid number between 0 and 100.";
    }
    if (!categoryIcon) {
      newErrors.categoryIcon = "Please select a Category Icon.";
    }
    if (!discountPhoto && !initialData?.discountPhoto) {
      newErrors.discountPhoto = "A discount photo is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const discountData = {
      id: initialData?.id || Date.now(),
      discountPercentage,
      description,
      discountName,
      categoryIcon,
      discountPhoto,
      discountIcon,
      dealIcon,
      date: new Date().toLocaleDateString(),
    };

    if (initialData) {
      onEditDiscount(discountData);
    } else {
      onAddDiscount(discountData);
    }
    setIsOpen(false);
  };

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || iconMap.help_outline;
    return <IconComponent className="h-4 w-4 mr-2" />;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            {initialData ? "EDIT DISCOUNT" : "ADD DISCOUNT"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Discount Percentage (%)"
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className={errors.discountPercentage ? "border-red-500" : ""}
              />
              {errors.discountPercentage && <p className="text-red-500 text-sm mt-1">{errors.discountPercentage}</p>}
            </div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Discount Name"
                value={discountName}
                onChange={(e) => setDiscountName(e.target.value)}
                className={errors.discountName ? "border-red-500" : ""}
              />
              {errors.discountName && <p className="text-red-500 text-sm mt-1">{errors.discountName}</p>}
            </div>
            <div>
              <Select onValueChange={setCategoryIcon} value={categoryIcon}>
                <SelectTrigger className={errors.categoryIcon ? "border-red-500" : ""}>
                  <SelectValue placeholder="Category Icon" />
                </SelectTrigger>
                <SelectContent>
                  {_categoryIcons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center">
                        {renderIcon(icon)}
                        <span>{icon.replace(/_/g, " ").toUpperCase()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryIcon && <p className="text-red-500 text-sm mt-1">{errors.categoryIcon}</p>}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border rounded-lg p-6 bg-muted/20 cursor-pointer hover:bg-muted relative">
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              {discountPhoto ? (
                <img src={discountPhoto} alt="Discount" className="w-full h-full object-cover rounded" />
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
                  <span className="mt-2 text-sm text-gray-500">Discount Photo</span>
                </div>
              )}
              <Input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {errors.discountPhoto && <p className="text-red-500 text-sm mt-1">{errors.discountPhoto}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select onValueChange={setDiscountIcon} value={discountIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Discount Icon" />
              </SelectTrigger>
              <SelectContent>
                {_discountIcons.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    <div className="flex items-center">
                      {renderIcon(icon)}
                      <span>{icon.replace(/_/g, " ").toUpperCase()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setDealIcon} value={dealIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Deal Icon" />
              </SelectTrigger>
              <SelectContent>
                {_dealIcons.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    <div className="flex items-center">
                      {renderIcon(icon)}
                      <span>{icon.replace(/_/g, " ").toUpperCase()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
  );
}