import { prisma } from "@/db/prisma";
import { decryptString } from "@/lib/crypto";
import { getUser } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NoteEditor from "./editor";

type Props = {
  params: { id: string };
};

async function NotePage({ params }: Props) {
  const { id } = await params;
  const noteId = id;

  const user = await getUser();

  // Redirect to login if not authenticated
  if (!user) {
    notFound();
  }

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user.id,
    },
  });

  // Return 404 if note doesn't exist or doesn't belong to user
  if (!note) {
    notFound();
  }

  return (
    <NoteEditor
      id={noteId}
      title={await decryptString(note.title as unknown as string)}
      content={await decryptString(note.body as unknown as string)}
      user={user}
    />
  );
}

export default NotePage;
