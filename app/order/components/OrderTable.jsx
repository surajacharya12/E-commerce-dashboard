import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";

// Component for the products table
const OrderTable = () => {
  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My Order</h2>
        <div className="flex items-center gap-8">
          <button className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
            <select className="border border-gray-700 bg-[#2a2f45] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Status</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Pending</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-hidden border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Custoer Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Order Amount</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Payment</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Status</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">Date</th>
              <th className="px-40 py-3 text-sm font-semibold text-gray-300">Edit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-700">
              <td className="px-12 py-4">iPhone 15 Pro</td>
              <td className="px-12 py-4">Mobiles</td>
              <td className="px-12 py-4">Mobiles</td>
              <td className="px-40 py-4">
                <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit className="h-4 w-4" />
                </button>
              </td>
              <td className="px-6 py-4">
                <button className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="px-12 py-4">Nike Air Max</td>
              <td className="px-12 py-4">Footwear</td>
              <td className="px-12 py-4">Mobiles</td>
              <td className="px-40 py-4">
                <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit className="h-4 w-4" />
                </button>
              </td>
              <td className="px-6 py-4">
                <button className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
