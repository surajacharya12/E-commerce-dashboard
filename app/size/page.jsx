"use client"

import { useState, useEffect } from "react";
import TopBar from "./components/TopBar"; // Assuming TopBar is in a common or reusable location
import SizeTable from "./components/SizeTable"; // New component
import url from '../http/page'; // Assuming your http configuration remains the same

import ProtectedLayout from "../components/ProtectedLayout"; // Assuming ProtectedLayout is generic
export default function SizePage() { // Renamed from VariantType
  const [sizes, setSizes] = useState([]); // State for sizes
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSize, setEditingSize] = useState(null); // State for editing a size

  const fetchSizes = async () => { // Function to fetch sizes
    try {
      const response = await fetch(`${url}sizes`); // API endpoint for sizes
      if (!response.ok) {
        throw new Error("Failed to fetch sizes.");
      }
      const data = await response.json();
      setSizes(data.data);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const filteredSizes = sizes.filter(size => // Filter sizes by search term
    size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (size.description && size.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
        <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
          <TopBar
            itemCount={sizes.length} // Pass total count of sizes
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            pageTitle="Size" // Title for the page
          />
          <SizeTable // Use the new SizeTable component
            sizes={filteredSizes}
            fetchSizes={fetchSizes}
            editingSize={editingSize}
            setEditingSize={setEditingSize}
          />
        </main>
      </div>
    </ProtectedLayout>
  );
}