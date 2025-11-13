import ChatBox from "@/components/ui/home/chatBox";

export default function Home() {
  return (
    <div className="h-screen">
      <div className="text-center text-4xl antialiased font-mono tracking-widest p-10">
        THE ULTIMATE TERMINAL
      </div>
      <div className="flex justify-center items-end p-10">
        <ChatBox />
      </div>
    </div>
  );
}
