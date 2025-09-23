import TopBar from "./components/TopBar";
import BrandTable from "./components/BrandTable";
// Main dashboard component that combines all others
// 
export default function Category() {
  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar />
        <BrandTable />
      </main>
    </div>
  );
}
