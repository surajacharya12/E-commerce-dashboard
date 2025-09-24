"use client"

import { Search } from "lucide-react";

const TopBar = ({ discountCount, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <h1 className="text-3xl font-bold text-white">Discount</h1>
      <div className="flex flex-wrap items-center gap-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search discounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-lg border border-gray-700 bg-[#2a2f45] text-white px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <p className="text-gray-400 text-sm">Total Discounts: {discountCount}</p>
      </div>
    </div>
  );
};

export default TopBar;