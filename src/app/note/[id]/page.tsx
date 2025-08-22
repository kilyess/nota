import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";
import NoteEditor from "./editor";

type Props = {
  params: { id: string };
};

async function NotePage({ params }: Props) {
  const { id } = await params;
  const noteId = id;

  const user = await getUser();

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id,
    },
  });

  return (
    <NoteEditor
      id={noteId}
      title={note?.title || ""}
      content={note?.body || ""}
      user={user}
    />
  );
}

export default NotePage;
