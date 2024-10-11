"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/services/auth.mutations";
import Link from "next/link";

export function UserNav() {
  const { data: currentUser } = useCurrentUser();

  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (currentUser?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={currentUser?.user.avatar ?? currentUser?.user.name}
                alt={currentUser?.user.name ?? ""}
              />
              <AvatarFallback>{currentUser?.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-[9999]" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {currentUser?.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {currentUser?.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={"/dashboard"}>
              <DropdownMenuItem>
                Dashboard
                {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={"/dashboard/profile/settings"}>
              <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isLoggingOut} onClick={() => logout({})}>
            {isLoggingOut ? "Logging out..." : "Log out"}
            {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return null;
}
