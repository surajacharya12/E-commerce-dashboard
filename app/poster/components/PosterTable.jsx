"use client"

import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import AddPosterDialog from "./AddPosterDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const PosterTable = ({ posters, onAddPoster, onEditPoster, onDeletePoster, onRefresh, editingPoster, setEditingPoster }) => {

  const handleDelete = async (posterId) => {
    const response = await onDeletePoster(posterId);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleEdit = (poster) => {
    setEditingPoster(poster);
  };

  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Posters</h2>
        <div className="flex items-center gap-8">
          <button onClick={onRefresh} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <AddPosterDialog onAddPoster={onAddPoster} onEditPoster={onEditPoster} initialData={editingPoster}>
            <AlertDialogTrigger asChild>
              <button onClick={() => setEditingPoster(null)} className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </AddPosterDialog>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Poster Image</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Poster Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {posters.length === 0 ? (
              <tr className="border-t border-gray-700">
                <td colSpan="5" className="px-12 py-4 text-center text-gray-400">
                  No Poster found.
                </td>
              </tr>
            ) : (
              posters.map((poster) => (
                <tr key={poster._id} className="border-t border-gray-700">
                  <td className="px-12 py-4">
                    {poster.imageUrl && (
                      <img src={poster.imageUrl} alt={poster.posterName} className="w-20 h-20 object-cover rounded" />
                    )}
                  </td>
                  <td className="px-12 py-4">{poster.posterName}</td>
                  <td className="px-12 py-4">{new Date(poster.createdAt).toLocaleDateString()}</td>
                  <td className="px-40 py-4">
                    <AddPosterDialog onAddPoster={onAddPoster} onEditPoster={onEditPoster} initialData={poster}>
                      <AlertDialogTrigger asChild>
                        <button onClick={() => handleEdit(poster)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                    </AddPosterDialog>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(poster._id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
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
  );
};

export default PosterTable;