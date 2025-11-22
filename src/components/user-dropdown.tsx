"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu"; // Change to shadcn import
import { ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"; // Change to shadcn import
import { logout } from "../lib/logout";

export function UserDropdown({ email }: { email: string | undefined }) {
  return (
    <>
      <div className="flex">
        <Avatar className="content-center mr-2">
          <AvatarImage
            className="bg-white"
            src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
            alt="@shadcn"
          />
          <AvatarFallback>Cy</AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="content-center text-gray-100 hover:text-gray-400 cursor-pointer">
              {email}
              <ChevronDownIcon className="inline-block ml-1 h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
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
