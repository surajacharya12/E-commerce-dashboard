"use client"

import { useState } from "react";
import TopBar from "./components/TopBar";
import PosterTable from "./components/PosterTable";

export default function Poster() {
  const [posters, setPosters] = useState([]);
  const [editingPoster, setEditingPoster] = useState(null);

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar posterCount={posters.length} />
        <PosterTable
          posters={posters}
          setPosters={setPosters}
          editingPoster={editingPoster}
          setEditingPoster={setEditingPoster}
        />
      </main>
    </div>
  );
}