import ChatBox from "@/src/components/app/chat-box";
import { getSession } from "../lib/session";

export default async function Home() {
  const session = await getSession();
  const username = (session?.username as string) || "Guest"; // Fallback if no session

  return (
    <div className="flex justify-center p-10 items-end w-full h-[80vh]">
      <ChatBox username={username} />
    </div>
  );
}
