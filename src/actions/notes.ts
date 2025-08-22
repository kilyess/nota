"use server";

import { prisma } from "@/db/prisma";
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

    await prisma.note.update({
      where: {
        id: noteId,
        authorId: user.id,
      },
      data: { title, body },
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

    const note = await prisma.note.create({
      data: { title: "", body: "", authorId: user.id, createdAt: new Date() },
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
