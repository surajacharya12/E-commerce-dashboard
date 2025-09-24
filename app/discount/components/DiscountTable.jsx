"use client"

import { useState } from "react"
import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import AddDiscountDialog from "./AddDiscountDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MdShoppingCart, MdCategory, MdInventory, MdStore, MdLocalMall, MdShoppingBag, MdStorefront, MdBusiness, MdLocalOffer, MdDiscount, MdPercent, MdSell, MdPriceChange, MdMonetizationOn, MdAttachMoney, MdSavings, MdFlashOn, MdStar, MdFavorite, MdThumbUp, MdCelebration, MdCardGiftcard, MdRedeem, MdLoyalty, MdHelpOutline } from "react-icons/md";

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

const renderIcon = (iconName) => {
  const IconComponent = iconMap[iconName] || iconMap.help_outline;
  return <IconComponent className="h-4 w-4 mr-2" />;
};

const DiscountTable = ({ discounts, setDiscounts, editingDiscount, setEditingDiscount }) => {
  const handleAddDiscount = (newDiscount) => {
    setDiscounts([...discounts, newDiscount]);
    setEditingDiscount(null);
  };

  const handleEditDiscount = (updatedDiscount) => {
    setDiscounts(discounts.map(discount => discount.id === updatedDiscount.id ? updatedDiscount : discount));
    setEditingDiscount(null);
  };

  const handleDeleteDiscount = (discountId) => {
    setDiscounts(discounts.filter(discount => discount.id !== discountId));
  };

  const handleRefresh = () => {
    setDiscounts([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Discount</h2>
        <div className="flex items-center gap-8">
          <button onClick={handleRefresh} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <AddDiscountDialog onAddDiscount={handleAddDiscount} onEditDiscount={handleEditDiscount} initialData={editingDiscount}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingDiscount(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddDiscountDialog>
        </div>
      </div>
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Discount Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Discount Image</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Discount Percentage</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id} className="border-t border-gray-700">
                <td className="px-12 py-4">{discount.discountName}</td>
                <td className="px-12 py-4">
                  {discount.discountPhoto && (
                    <img src={discount.discountPhoto} alt={discount.discountName} className="w-20 h-20 object-cover rounded" />
                  )}
                </td>
                <td className="px-12 py-4">{discount.discountPercentage}%</td>
                <td className="px-12 py-4">{discount.date}</td>
                <td className="px-40 py-4">
                  <AddDiscountDialog onAddDiscount={handleAddDiscount} onEditDiscount={handleEditDiscount} initialData={discount}>
                    <AlertDialogTrigger asChild>
                      <button onClick={() => setEditingDiscount(discount)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                  </AddDiscountDialog>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDeleteDiscount(discount.id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountTable;