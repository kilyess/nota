"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Note, User } from "@prisma/client";
import { useState } from "react";
import LogOutButton from "./LogOutButton";
import Settings from "./Settings";

type Props = {
  user: User | null;
  notes: Note[];
};

export function NavUser({ user, notes }: Props) {
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const handleUpdate = (
    avatar: string | null,
    firstName: string,
    lastName: string,
  ) => {
    setAvatar(avatar);
    setFirstName(firstName);
    setLastName(lastName);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-12 w-full items-center justify-between gap-2 overflow-hidden p-2 text-left text-sm outline-hidden">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={avatar || undefined}
              alt={firstName + " " + lastName}
            />
            <AvatarFallback className="rounded-lg">
              {firstName && lastName
                ? (firstName[0] + lastName[0]).toUpperCase()
                : ""}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {firstName + " " + lastName}
            </span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
          <div className="flex">
            <Settings user={user} notes={notes} onUpdate={handleUpdate} />
            <LogOutButton />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
