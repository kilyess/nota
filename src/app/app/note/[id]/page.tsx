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
  const { title, body } = await getDecryptedNoteAction(noteId);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nota.ma";
  const description = body
    ? body.slice(0, 160).replace(/<[^>]*>/g, "")
    : "View your note in nota";

  return {
    title: `${title} - nota`,
    description,
    robots: {
      index: false, // Private notes should not be indexed
      follow: false,
    },
    alternates: {
      canonical: `${baseUrl}/app/note/${noteId}`,
    },
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
