import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import VariantTypeTableDialog from "./VariantTypeTableDialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
// Component for the products table

const VariantTypeTable = () => {
  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-300">My VariantType</h2>
        <div className="flex items-center gap-8">
          <button className="p-2 rounded-lg bg-[#2a2f45] hover:bg-[#353b52] border border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-300" />
          </button>
         {/* Add Product Dialog with "Add New" button as trigger */}
          <VariantTypeTableDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow">
                <Plus className="h-5 w-5" /> Add New
              </button>
            </AlertDialogTrigger>
          </VariantTypeTableDialog>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#2a2f45] rounded-xl shadow overflow-hidden border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e2235]">
            <tr>
              <th className="px-12 py-6 text-sm font-semibold text-gray-300">Variant Name</th>
              <th className="px-12 py-3 text-sm font-semibold text-gray-300">VariantType</th>
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

export default VariantTypeTable;
