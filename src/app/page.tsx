import { ChatInterface } from "@/components/chat-interface";
import { NavBar } from "@/components/nav-bar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
