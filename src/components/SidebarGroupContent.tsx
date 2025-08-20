"use client";

import { Note } from "@prisma/client";

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  return <div>SidebarGroupContent</div>;
}

export default SidebarGroupContent;
