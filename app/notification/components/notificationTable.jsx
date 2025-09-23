"use client"
import { useState, useEffect } from "react"
import { Edit, Trash2, RefreshCw, Plus } from "lucide-react"
import NotificationDialog from "./AddNotificationDialog"
import url from "@/app/http/page"

const NotificationTable = () => {
  const [notifications, setNotifications] = useState([])
  const [dialogState, setDialogState] = useState({ open: false, mode: 'add', data: null })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    const res = await fetch(`${url}/notification`)
    const data = await res.json()
    if (data.success) {
      setNotifications(data.data)
    }
  }

  const handleAction = async (formData) => {
    if (dialogState.mode === 'add') {
      const res = await fetch(`${url}/notification`, { 
        method: "POST", 
        body: formData 
      })
      const data = await res.json()
      if (data.success) {
        setNotifications((prev) => [data.data, ...prev])
      }
    } else if (dialogState.mode === 'edit') {
      const res = await fetch(`${url}/notification/${dialogState.data._id}`, { 
        method: "PUT", 
        body: formData 
      })
      const data = await res.json()
      if (data.success) {
        setNotifications((prev) => prev.map((n) => (n._id === data.data._id ? data.data : n)))
      }
    }
    setDialogState({ open: false, mode: 'add', data: null })
  }

  const handleDelete = async (id) => {
    const res = await fetch(`${url}/notification/${id}`, { method: "DELETE" })
    const data = await res.json()
    if (data.success) {
      setNotifications((prev) => prev.filter((n) => n._id !== id))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Notifications</h2>
        <div className="flex items-center gap-4">
          <button onClick={fetchNotifications} className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
          <button onClick={() => setDialogState({ open: true, mode: 'add', data: null })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
            <Plus className="h-5 w-5" /> Add New
          </button>
        </div>
      </div>
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-hidden border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Image</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Title</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Description</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Created</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">No notifications found</td>
              </tr>
            ) : (
              notifications.map((n) => (
                <tr key={n._id} className="border-t border-gray-700">
                  <td className="px-6 py-4">
                    {n.imageUrl ? <img src={n.imageUrl} alt={n.title} className="w-16 h-16 object-cover rounded" /> : "—"}
                  </td>
                  <td className="px-6 py-4">{n.title}</td>
                  <td className="px-6 py-4">{n.description}</td>
                  <td className="px-6 py-4">{new Date(n.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => setDialogState({ open: true, mode: 'edit', data: n })} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(n._id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <NotificationDialog
        open={dialogState.open}
        mode={dialogState.mode}
        notification={dialogState.data}
        onAction={handleAction}
        onClose={() => setDialogState({ open: false, mode: 'add', data: null })}
      />
    </div>
  )
}

export default NotificationTable