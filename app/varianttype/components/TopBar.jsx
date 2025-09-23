import { Search } from "lucide-react"; // Component for the top navigation bar
const TopBar = () => { return (
<div
  className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
>
  <h1 className="text-3xl font-bold text-white">VariantType</h1>
  <div className="flex flex-wrap items-center gap-8">
    {/* Search */}
    <div className="relative">
      <input
        type="text"
        placeholder="Search orders..."
        className="w-72 rounded-lg border border-gray-700 bg-[#2a2f45] text-white px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  </div>
</div>
); }; export default TopBar;
