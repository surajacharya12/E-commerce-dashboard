import OrderDetails from "./components/OrderDetails";
import TopBar from "./components/TopBar";
import StatsCards from "./components/StatsCards";
import ProductsTable from "./components/ProductTable";
// Main dashboard component that combines all others
// 
export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar />
        <StatsCards />
        <ProductsTable />
      </main>
      {/* Sidebar */}
      <aside className="w-80 bg-[#1f2937] border-l border-gray-700 h-full hidden md:flex flex-col">
        <OrderDetails />
      </aside>
    </div>
  );
}
