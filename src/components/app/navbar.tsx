"use client";
import { useRouter } from "next/navigation";
import { UserDropdown } from "./user-dropdown";

export default function NavBar({
  username,
  isAdmin,
  profilePictureUrl,
}: {
  username?: string;
  isAdmin?: boolean;
  profilePictureUrl?: string;
}) {
  const router = useRouter();

  return (
    <div className="sticky top-0 left-0 w-full z-10">
      <div className="flex justify-between antialiased  p-4 pl-6 border-b bg-background/80">
        <span
          className="text-xl font-mono tracking-widest cursor-pointer"
          onClick={() => router.push("/")}
        >
          CYBERSPACE.FORUM
        </span>
        {username && (
          <UserDropdown
            username={username}
            isAdmin={isAdmin}
            profilePictureUrl={profilePictureUrl}
          />
        )}
      </div>
    </div>
  );
}
