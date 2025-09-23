import TopBar from "./components/TopBar";
import VariantTypeTable from "./components/VariantTypeTable";
// Main dashboard component that combines all others

export default function VariantType() {
  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar />
        <VariantTypeTable />
      </main>
    </div>
  );
}
