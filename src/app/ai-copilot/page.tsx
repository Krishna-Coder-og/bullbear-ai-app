import { AICopilotCard } from "@/components/dashboard/AICopilotCard";
import { Sidebar } from "../../components/dashboard/Sidebar";

export default function AiCopilotPage() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 p-8 flex flex-col">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">AI Co-Pilot</h2>
          <p className="text-gray-400">Your intelligent financial research assistant. Ask me anything.</p>
        </header>
        <div className="flex-1">
           <AICopilotCard />
        </div>
      </main>
    </div>
  );
}