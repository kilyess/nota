"use server";

import { prisma } from "@/db/prisma";
import { decryptString, encryptString } from "@/lib/crypto";
import { handleError } from "@/lib/utils";
import {
  createAdminClient,
  createClient,
  getUser,
} from "@/utils/supabase/server";

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signInWithPassword({ email, password });

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signOut();

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signUpAction = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  try {
    const { auth } = await createClient();

    const { data, error } = await auth.signUp({ email, password });

    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("Error signing up.");

    await prisma.user.create({
      data: {
        id: userId,
        email,
        firstName,
        lastName,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteAccountAction = async () => {
  try {
    const { auth, storage } = await createAdminClient();

    const user = await getUser();

    if (!user)
      throw new Error("Please login or sign up to delete your account");

    const { error: authError } = await auth.admin.deleteUser(user.id);
    if (authError) throw authError;

    await prisma.user.delete({
      where: { id: user.id },
      include: {
        notes: true,
      },
    });

    const { data: avatarList, error: listError } = await storage
      .from("avatars")
      .list("", { search: user.id });
    if (listError) throw listError;
    const avatarExists = avatarList?.some(
      (file: { name: string }) => file.name === user.id,
    );
    if (avatarExists) {
      await storage.from("avatars").remove([user.id]);
    }

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const getDecryptedApiKeyAction = async () => {
  try {
    const user = await getUser();

    if (!user) throw new Error("Please login or sign up to get your API key");

    const result = await prisma.user.findUnique({
      where: { id: user.id },
      select: { apiKey: true },
    });

    if (!result?.apiKey) throw new Error("No API key found");

    const decryptedApiKey = await decryptString(result.apiKey);

    return { errorMessage: null, apiKey: decryptedApiKey };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { errorMessage, apiKey: null };
  }
};

export const uploadAvatarAction = async (formData: FormData) => {
  try {
    const { storage } = await createClient();

    const user = await getUser();

    if (!user) throw new Error("Please login or sign up to upload an avatar");

    const avatar = formData.get("avatar") as File;

    if (avatar.size >= 1024 * 1024 * 2)
      throw new Error("Avatar size must be less or equal to 2MB");

    const fileExtension = avatar.name.split(".").pop();

    const filePath = `${user.id}.${fileExtension}`;

    const { error } = await storage.from("avatars").upload(filePath, avatar, {
      upsert: true,
      cacheControl: "0",
    });

    if (error) throw error;

    const avatarUrl = storage.from("avatars").getPublicUrl(filePath)
      .data.publicUrl;

    return { errorMessage: null, avatarUrl };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { errorMessage, avatarUrl: null };
  }
};

export const updateAvatarAction = async (formData: FormData) => {
  try {
    const user = await getUser();

    if (!user) throw new Error("Please login or sign up to update your avatar");

    let newAvatarUrl: string | null = null;

    const avatar = formData.get("avatar") as File | null;

    if (avatar) {
      const { errorMessage, avatarUrl } = await uploadAvatarAction(formData);
      if (errorMessage) throw new Error(errorMessage);
      newAvatarUrl = `${avatarUrl}?t=${new Date().getTime()}`;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatar: newAvatarUrl || "",
      },
    });

    return { errorMessage: null, avatarUrl: newAvatarUrl };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { errorMessage, avatarUrl: null };
  }
};

export const deleteAvatarAction = async (url: string) => {
  try {
    const { storage } = await createClient();

    const user = await getUser();

    if (!user) throw new Error("Please login or sign up to delete your avatar");

    const { error } = await storage.from("avatars").remove([url]);

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { errorMessage };
  }
};

export const updateUserAction = async (
  firstName?: string,
  lastName?: string,
) => {
  try {
    const user = await getUser();

    if (!user)
      throw new Error("Please login or sign up to update your profile");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName,
        lastName: lastName,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateApiKeyAction = async (apiKey: string) => {
  try {
    const user = await getUser();

    if (!user)
      throw new Error("Please login or sign up to update your API key");

    if (apiKey.length === 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { apiKey: "" },
      });
      return { errorMessage: null };
    }

    const { errorMessage, apiKey: oldApiKey } =
      await getDecryptedApiKeyAction();

    if (errorMessage === "No API key found") {
      const newApiKey = await encryptString(apiKey);
      await prisma.user.update({
        where: { id: user.id },
        data: { apiKey: newApiKey },
      });
      return { errorMessage: null };
    }

    if (apiKey === oldApiKey)
      throw new Error("New API key is the same as the old one");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) throw new Error("Invalid API key");

    const newApiKey = await encryptString(apiKey);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        apiKey: newApiKey,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { errorMessage };
  }
};
