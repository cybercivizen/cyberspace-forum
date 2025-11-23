import { UserDropdown } from "./user-dropdown";

export default function NavBar({
  username,
  isAdmin,
}: {
  username?: string;
  isAdmin?: boolean;
}) {
  return (
    <div className="sticky top-0 left-0 w-full z-10">
      <div className="flex justify-between antialiased  p-4 pl-6 border-b bg-background/80">
        <span className="text-xl font-mono tracking-widest">
          THE ULTIMATE TERMINAL
        </span>
        {username && <UserDropdown username={username} isAdmin={isAdmin} />}
      </div>
    </div>
  );
}
