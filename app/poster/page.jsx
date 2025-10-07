"use client"

import { useState, useEffect, useCallback } from "react";
import TopBar from "./components/TopBar";
import PosterTable from "./components/PosterTable";
import url from "../http/page";
import { toast } from "sonner";

import ProtectedLayout from "../components/ProtectedLayout";
export default function Poster() {
  const [posters, setPosters] = useState([]);
  const [editingPoster, setEditingPoster] = useState(null);

  const fetchPosters = useCallback(async () => {
    try {
      const res = await fetch(`${url}posters`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setPosters(data.data);
      } else {
        console.error("API returned an unexpected structure:", data);
        setPosters([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setPosters([]);
      toast.error("Failed to fetch posters.");
    }
  }, []);

  useEffect(() => {
    fetchPosters();
  }, [fetchPosters]);

  const handleAddPoster = async (newPosterData) => {
    try {
      const formData = new FormData();
      formData.append("posterName", newPosterData.posterName);
      if (newPosterData.posterFile) {
        formData.append("img", newPosterData.posterFile);
      }

      const res = await fetch(`${url}posters`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchPosters();
        return { success: true, message: "Poster added successfully." };
      } else {
        return { success: false, message: data.message || "Failed to add poster." };
      }
    } catch (error) {
      console.error("Add poster error:", error);
      return { success: false, message: "An error occurred while adding the poster." };
    }
  };

  const handleEditPoster = async (updatedPosterData) => {
    try {
      const formData = new FormData();
      formData.append("posterName", updatedPosterData.posterName);
      if (updatedPosterData.posterFile) {
        formData.append("img", updatedPosterData.posterFile);
      }

      const res = await fetch(`${url}posters/${updatedPosterData._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchPosters();
        setEditingPoster(null);
        return { success: true, message: "Poster updated successfully." };
      } else {
        return { success: false, message: data.message || "Failed to update poster." };
      }
    } catch (error) {
      console.error("Edit poster error:", error);
      return { success: false, message: "An error occurred while updating the poster." };
    }
  };

  const handleDeletePoster = async (posterId) => {
    try {
      const res = await fetch(`${url}posters/${posterId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchPosters();
        return { success: true, message: "Poster deleted successfully." };
      } else {
        return { success: false, message: data.message || "Failed to delete poster." };
      }
    } catch (error) {
      console.error("Delete poster error:", error);
      return { success: false, message: "An error occurred while deleting the poster." };
    }
  };

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[#111827] text-white">
        <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
          <TopBar posterCount={posters.length} />
          <PosterTable
            posters={posters}
            onAddPoster={handleAddPoster}
            onEditPoster={handleEditPoster}
            onDeletePoster={handleDeletePoster}
            onRefresh={fetchPosters}
            editingPoster={editingPoster}
            setEditingPoster={setEditingPoster}
          />
        </main>
      </div>
    </ProtectedLayout>
  );
}