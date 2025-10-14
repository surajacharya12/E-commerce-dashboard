"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react"
import AddColorDialog from "./AddColorDialog"
import { AlertDialogTrigger } from "@/components/ui/alert-dialog"
import url from "../../http/page"

const ColorTable = ({ colors, fetchColors, editingColor, setEditingColor }) => {
  const handleAddColor = async (newColor) => {
    try {
      const response = await fetch(`${url}colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newColor),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add color.")
      }
      fetchColors()
      setEditingColor(null)
    } catch (error) {
      console.error("Error adding color:", error)
      alert(error.message)
    }
  }

  const handleEditColor = async (id, updatedColor) => {
    try {
      const response = await fetch(`${url}colors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedColor),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update color.")
      }
      fetchColors()
      setEditingColor(null)
    } catch (error) {
      console.error("Error updating color:", error)
      alert(error.message)
    }
  }

  const handleDeleteColor = async (id) => {
    try {
      const response = await fetch(`${url}colors/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete color.")
      }
      fetchColors()
    } catch (error) {
      console.error("Error deleting color:", error)
      alert(error.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Colors</h2>
        <div className="flex items-center gap-8">
          <button
            onClick={fetchColors}
            className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700"
          >
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>

          <AddColorDialog
            onAddColor={handleAddColor}
            onEditColor={handleEditColor}
            initialData={editingColor}
          >
            <AlertDialogTrigger asChild>
              <button
                onClick={() => setEditingColor(null)}
                className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow"
              >
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddColorDialog>
        </div>
      </div>

      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Color Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Hex Code</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Category</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>

          <tbody>
            {colors.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="6" className="px-12 py-4 text-center text-gray-400">
                  No colors found.
                </td>
              </tr>
            ) : (
              colors.map((color) => (
                <tr key={color._id} className="border-t border-gray-700">
                  <td className="px-12 py-4">{color.name}</td>
                  <td className="px-12 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-500"
                        style={{ backgroundColor: color.hexCode || "#000000" }}
                      />
                      {color.hexCode || "N/A"}
                    </div>
                  </td>
                  <td className="px-12 py-4">{color.category || "N/A"}</td>
                  <td className="px-12 py-4">
                    {new Date(color.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-40 py-4">
                    <AddColorDialog
                      onAddColor={handleAddColor}
                      onEditColor={handleEditColor}
                      initialData={color}
                    >
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => setEditingColor(color)}
                          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddColorDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteColor(color._id)}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ColorTable
