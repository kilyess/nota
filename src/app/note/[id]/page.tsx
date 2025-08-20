import NoteEditor from "./editor";

function NotePage({ params }: { params: { id: string } }) {
  return <NoteEditor id={params.id} />;
}

export default NotePage;
