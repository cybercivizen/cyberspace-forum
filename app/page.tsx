import { Card } from "@/components/ui/card";
import ChatBox from "@/components/ui/home/chatBox";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-end p-10">
        <ChatBox />
      </div>
    </div>
  );
}
