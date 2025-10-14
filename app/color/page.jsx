"use client"

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import ColorTable from "./components/ColorTable";
import ProtectedLayout from "../components/ProtectedLayout";
import url from '../http/page';
import { usePathname } from 'next/navigation';

export default function Color() {
  const [colors, setColors] = useState([]);
  // Removed colorTypes state as it's no longer a separate entity
  const [searchTerm, setSearchTerm] = useState("");
  const [editingColor, setEditingColor] = useState(null);
  const pathname = usePathname();

  const fetchColors = async () => {
    try {
      const response = await fetch(`${url}colors`);
      if (!response.ok) {
        throw new Error("Failed to fetch colors.");
      }
      const data = await response.json();
      setColors(data.data);
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  // Removed fetchColorTypes as it's no longer needed

  useEffect(() => {
    fetchColors();
    // Removed fetchColorTypes call
  }, [pathname]);

  const filteredColors = colors.filter(color => {
    return color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.hexCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.category?.toLowerCase().includes(searchTerm.toLowerCase()); // Include category in search
  });

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
        <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
          <TopBar
            pageTitle="Color"
            itemCount={colors.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <ColorTable
            colors={filteredColors}
            fetchColors={fetchColors}
            editingColor={editingColor}
            setEditingColor={setEditingColor}
          />
        </main>
      </div>
    </ProtectedLayout>
  );
}