"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"; // Change to shadcn import
import { ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { logout } from "../../lib/auth/logout";
import { useRouter } from "next/navigation";

export function UserDropdown({
  username,
  isAdmin,
}: {
  username?: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  return (
    <>
      <div className="flex">
        <Avatar className="content-center mr-2">
          <AvatarImage
            className="bg-white"
            src="/profile-pic.jpg"
            alt="@shadcn"
          />
          <AvatarFallback>Cy</AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="content-center text-gray-100 hover:text-gray-400 cursor-pointer">
              {username}
              <ChevronDownIcon className="inline-block ml-1 h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Administration</DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
