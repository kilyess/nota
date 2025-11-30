import { getDecryptedNoteAction } from "@/actions/notes";
import { getUser } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import NoteEditor from "./editor";
import NoteNotFound from "./not-found";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: noteId } = await params;
  const { title } = await getDecryptedNoteAction(noteId);

  return {
    title: `${title} - nota`,
  };
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function NotePage({ params }: PageProps) {
  const { id: noteId } = await params;

  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { title, body, errorMessage } = await getDecryptedNoteAction(noteId);

  if (errorMessage) {
    return <NoteNotFound />;
  }

  return <NoteEditor id={noteId} title={title} content={body} user={user} />;
}

export default NotePage;
