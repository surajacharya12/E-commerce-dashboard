"use client";
import { useState } from "react";
import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import NotificationDialog from "./AddNotificationDialog";
import { Input } from "@/components/ui/input";

const NotificationTable = ({
  notifications,
  isLoading,
  fetchNotifications,
  handleAction,
  handleDelete,
}) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    mode: "add",
    data: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTableRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-6 text-gray-400">
            Loading notifications...
          </td>
        </tr>
      );
    }
    if (filteredNotifications.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-6 text-gray-400">
            No notifications found
          </td>
        </tr>
      );
    }
    return filteredNotifications.map((n) => (
      <tr key={n._id} className="border-t border-gray-700">
        <td className="px-6 py-4">
          {n.imageUrl ? (
            <img
              src={n.imageUrl}
              alt={n.title}
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            "—"
          )}
        </td>
        <td className="px-6 py-4">{n.title}</td>
        <td className="px-6 py-4">{n.description}</td>
        <td className="px-6 py-4">
          {new Date(n.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 flex gap-2">
          <button
            onClick={() =>
              setDialogState({ open: true, mode: "edit", data: n })
            }
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(n._id)}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">
          My Notifications
        </h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] bg-[#1e2235] text-white border-gray-700 placeholder-gray-500"
          />
          <button
            onClick={fetchNotifications}
            className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700"
          >
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <button
            onClick={() =>
              setDialogState({ open: true, mode: "add", data: null })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow"
          >
            <Plus className="h-5 w-5" /> Add New
          </button>
        </div>
      </div>
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-x-auto border border-gray-700 w-full">
        <table className="min-w-[1370px] text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">
                Image
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">
                Title
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">
                Description
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">
                Created
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>
      <NotificationDialog
        open={dialogState.open}
        mode={dialogState.mode}
        notification={dialogState.data}
        onAction={handleAction} // ✅ FIXED: now passed down
        onClose={() => setDialogState({ open: false, mode: "add", data: null })}
      />
    </div>
  );
};

export default NotificationTable;