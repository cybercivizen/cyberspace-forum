import ChatBox from "@/src/components/app/chat-box";
import { getSession } from "../lib/auth/session";
import { Message, SessionData } from "../lib/types";
import { getUserProfile } from "../lib/repositories/user-repository";
import { getAllMessages } from "../lib/repositories/msg-repository";

export default async function Home() {
  const session = (await getSession()) as SessionData;
  const userProfile = await getUserProfile(session.userId);
  const initialMessages = (await getAllMessages(userProfile.id)) as Message[];

  return (
    <div className="flex justify-center p-10 items-end w-full h-[80vh]">
      <ChatBox userProfile={userProfile} initialMessages={initialMessages} />
    </div>
  );
}
