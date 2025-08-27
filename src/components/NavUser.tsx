"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Note, User } from "@prisma/client";
import LogOutButton from "./LogOutButton";
import Settings from "./Settings";

type Props = {
  user: User | null;
  notes: Note[];
  onSelectedNotesDeleted: (selectedNotes: string[]) => void;
};

export function NavUser({ user, notes, onSelectedNotesDeleted }: Props) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-12 w-full items-center justify-between gap-2 overflow-hidden p-2 text-left text-sm outline-hidden">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user?.avatar}
              alt={user?.firstName + " " + user?.lastName}
            />
            <AvatarFallback className="rounded-lg">
              {user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : ""}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user?.firstName + " " + user?.lastName}
            </span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
          <div className="flex">
            <Settings
              user={user}
              notes={notes}
              onSelectedNotesDeleted={onSelectedNotesDeleted}
            />
            <LogOutButton />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
