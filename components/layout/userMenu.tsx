"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { doLogOut } from "@/lib/actions/user/authActions";
import Link from "next/link";

export default function UserMenu({
  user,
}: {
  user: {
    id: string;
    role: string;
    image?: string | null;
    name: string | null;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 cursor-pointer transition-transform hover:scale-105">
          <AvatarImage src={user?.image ?? undefined} alt="User icon" />
          <AvatarFallback>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mt-2 w-40" align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full cursor-pointer">
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-700"
          onClick={async () => await doLogOut()}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
