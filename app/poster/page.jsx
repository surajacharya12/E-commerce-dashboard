import TopBar from "./components/TopBar";
import PosterTable from "./components/PosterTable";
// Main dashboard component that combines all others

export default function Poster() {
  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col md:p-10 gap-10 overflow-y-auto">
        <TopBar />
        <PosterTable />
      </main>
    </div>
  );
}
