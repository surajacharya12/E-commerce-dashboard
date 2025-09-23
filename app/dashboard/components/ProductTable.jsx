import { Edit, Trash2 } from "lucide-react";

// Component for the products table
const ProductsTable = () => {
  return (
    <div className="bg-[#2a2f45] rounded-xl shadow overflow-hidden border border-gray-700">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#1e2235]">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Product Name</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Category</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Sub Category</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Price</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Edit</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-300">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-700">
            <td className="px-6 py-4">iPhone 15 Pro</td>
            <td className="px-6 py-4">Mobiles</td>
            <td className="px-6 py-4">Smartphones</td>
            <td className="px-6 py-4 text-white">$999</td>
            <td className="px-6 py-4">
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
            <td className="px-6 py-4">Nike Air Max</td>
            <td className="px-6 py-4">Footwear</td>
            <td className="px-6 py-4">Shoes</td>
            <td className="px-6 py-4 text-white">$150</td>
            <td className="px-6 py-4">
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
  );
};

export default ProductsTable;
