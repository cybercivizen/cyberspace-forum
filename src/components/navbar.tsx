import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function NavBar() {
  return (
    <div className="sticky top-0 left-0 w-full z-10">
      <div className="flex justify-between antialiased  p-4 pl-6 border-b bg-background/80">
        <span className="text-xl font-mono tracking-widest">
          THE ULTIMATE TERMINAL
        </span>
        <div className="flex">
          <Avatar className="content-center mr-2">
            <AvatarImage
              className="bg-white"
              src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
              alt="@shadcn"
            />
            <AvatarFallback>Cy</AvatarFallback>
          </Avatar>
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}

function UserDropdown() {
  const username = "Cybercivizen";
  return (
    <>
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
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
