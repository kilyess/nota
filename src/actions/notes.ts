"use server";

import { prisma } from "@/db/prisma";
import { encryptString } from "@/lib/crypto";
import { handleError } from "@/lib/utils";
import { getUser } from "@/utils/supabase/server";

export const updateNoteAction = async (
  noteId: string,
  title: string,
  body: string,
) => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
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

export const createNoteAction = async () => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const encryptedTitle = await encryptString("New Note");
    const encryptedBody = await encryptString("");

    const note = await prisma.note.create({
      data: {
        title: encryptedTitle,
        body: encryptedBody,
        authorId: user.id,
        createdAt: new Date(),
      },
    });

    return { noteId: note.id, errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
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
      throw new Error("Unauthorized");
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
