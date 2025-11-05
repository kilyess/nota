"use server";

import { getDecryptedApiKeyAction } from "@/actions/users";
import { prisma } from "@/db/prisma";
import { decryptString, encryptString } from "@/lib/crypto";
import { handleError } from "@/lib/utils";
import openai from "@/openai";
import { getUser } from "@/utils/supabase/server";
import { htmlToText } from "html-to-text";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const updateNoteAction = async (
  noteId: string,
  title: string,
  body: string,
) => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("You must be logged in to update a note");
    }

    const encryptedTitle = await encryptString(title);
    const encryptedBody = await encryptString(body);

    await prisma.note.update({
      where: {
        id: noteId,
        authorId: user.id,
      },
      data: { title: encryptedTitle, body: encryptedBody },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const createNoteAction = async (title: string = "New Note") => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Please login or sign up to create a new note.");
    }

    const encryptedTitle = await encryptString(title);
    const encryptedBody = await encryptString("");

    const note = await prisma.note.create({
      data: {
        title: encryptedTitle,
        body: encryptedBody,
        authorId: user.id,
        createdAt: new Date(),
      },
    });

    return { note, errorMessage: null };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { note: null, errorMessage };
  }
};

export const getDecryptedNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Please login or sign up to get a note");
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId, authorId: user.id },
    });

    if (!note) {
      throw new Error("Note not found");
    }

    const decryptedTitle = await decryptString(note.title);
    const decryptedBody = await decryptString(note.body);

    return {
      title: decryptedTitle,
      body: decryptedBody,
      errorMessage: null,
    };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { title: "", body: "", errorMessage };
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Please login or sign up to delete a note");
    }

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteSelectedNotesAction = async (noteIds: string[]) => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Please login or sign up to delete notes");
    }

    await prisma.note.deleteMany({
      where: { id: { in: noteIds }, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const togglePinNoteAction = async (noteId: string, pinned: boolean) => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Please login or sign up to pin a note");
    }

    await prisma.note.update({
      where: { id: noteId, authorId: user.id },
      data: { pinned },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (
  questions: string[],
  responses: string[],
) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Please login or sign up to ask AI about your notes");
  }

  // Fetch API key directly on the server to avoid serialization issues
  const { apiKey, errorMessage } = await getDecryptedApiKeyAction();

  if (!apiKey || errorMessage) {
    throw new Error("Please set your API key in the settings");
  }

  // Trim the API key to remove any potential whitespace
  const trimmedApiKey = apiKey.trim();

  if (!trimmedApiKey) {
    throw new Error("Invalid API key. Please set your API key in the settings");
  }

  let notes = await prisma.note.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      body: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  notes = await Promise.all(
    notes.map(async (n) => {
      const body = await decryptString(n.body as unknown as string);

      const plainTextBody = htmlToText(body);

      return {
        ...n,
        body: plainTextBody,
      };
    }),
  );

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes = notes
    .map((note) =>
      `
      [Note]
      Text: ${note.body}
      Created At: ${note.createdAt.toISOString()}
      Updated At: ${note.updatedAt.toISOString()}
    `.trim(),
    )
    .join("\n---\n");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "developer",
      content: `
          You are a helpful assistant that answers questions about a user's notes. 
          Assume all questions are related to the user's notes. 
          Make sure that your answers are not too verbose and you speak succinctly. 
          Your responses MUST be formatted in clean, valid HTML with proper structure. 
          Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
          Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph.
          DO NOT use <html>, <head>, or <body> tags. 
          Avoid inline styles, JavaScript, or custom attributes.
          
          Rendered like this in JSX:
          <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
    
          Here are the user's notes:
          ${formattedNotes}
          `,
    },
  ];

  for (let i = 0; i < questions.length; i++) {
    messages.push({ role: "user", content: questions[i] });
    if (responses.length > i) {
      messages.push({ role: "assistant", content: responses[i] });
    }
  }

  const openaiClient = openai(trimmedApiKey);

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return completion.choices[0].message.content || "A problem has occurred";
};
