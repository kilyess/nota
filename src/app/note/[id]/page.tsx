import { getDecryptedNoteAction } from "@/actions/notes";
import NotFound from "@/app/not-found";
import { getUser } from "@/utils/supabase/server";
import NoteEditor from "./editor";

type Props = {
  params: { id: string } | Promise<{ id: string }>;
};

async function NotePage({ params }: Props) {
  const { id } = await params;
  const noteId = id;

  const user = await getUser();

  if (!user) {
    return <NotFound isLoggedIn={false} />;
  }

  const { title, body, errorMessage } = await getDecryptedNoteAction(noteId);

  if (errorMessage) {
    return <NotFound isLoggedIn={!!user} />;
  }

  return <NoteEditor id={noteId} title={title} content={body} user={user} />;
}

export default NotePage;
