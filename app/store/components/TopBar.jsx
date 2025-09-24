"use client"

import { Search } from "lucide-react";

const TopBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <h1 className="text-3xl font-bold text-white">Store</h1>
      <div className="flex flex-wrap items-center gap-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#2a2f45] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;