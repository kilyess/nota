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

    try {
      await prisma.user.create({
        data: {
          id: userId,
          email,
          firstName,
          lastName,
        },
      });
    } catch (dbError) {
      // If user already exists in database, it means they signed up before
      // but the Supabase auth might have been reset. Handle gracefully.
      const errorString = String(dbError);
      if (
        errorString.includes("Unique constraint") ||
        errorString.includes("duplicate key")
      ) {
        throw new Error(
          "An account with this email already exists. Please log in instead.",
        );
      }
      throw dbError;
    }

    const content = `
      <h1>Welcome to nota! 🎉</h1>
      <p>
        We're excited to have you here. <strong>nota</strong> is your new AI-powered note-taking companion, designed to help you organize your thoughts and get instant answers from your notes. Here’s what you can do on the platform:
      </p>
      <h2>Features</h2>
      <ul class="list-disc">
        <li class="list-item">
          <p><strong>AI Assistant:</strong> Ask anything about your notes and get smart, instant responses.</p>
        </li>
        <li class="list-item">
          <p><strong>Super User-Friendly:</strong> Experience a seamless, distraction-free interface inspired by the best in chat design.</p>
        </li>
        <li class="list-item">
          <p><strong>Organize Effortlessly:</strong> Create, edit, and manage your notes with ease.</p>
        </li>
        <li class="list-item">
          <p><strong>Modern Design:</strong> Enjoy a clean and intuitive look thanks to shadcn/ui.</p>
        </li>
      </ul>
      <h2>Get Creative</h2>
      <p>
        Whether you’re jotting down ideas, planning your day, or storing important information, <strong>nota</strong> makes the process simple and enjoyable. Experiment, explore, and make your workspace truly yours!
      </p>
      <h2>Have Fun! 🚀</h2>
      <p>
        This platform is built to empower you, so dive in and discover how easy note-taking can be.
      </p>
      <hr>
      <h2>Connect with Me</h2>
      <ul class="list-disc">
        <li class="list-item">
          <p>
            <strong>Github:</strong>
            <a
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="text-ring hover:underline! hover:text-ring/80 cursor-pointer no-underline!"
              href="https://github.com/kilyess"
            >kilyess</a>
          </p>
        </li>
        <li class="list-item">
          <p>
            <strong>Linkedin:</strong>
            <a
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="text-ring hover:underline! hover:text-ring/80 cursor-pointer no-underline!"
              href="https://linkedin.com/in/ilyass-krichi"
            >Ilyass Krichi</a>
          </p>
        </li>
        <li class="list-item">
          <p>
            <strong>Email:</strong>
            <a
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="text-ring hover:underline! hover:text-ring/80 cursor-pointer no-underline!"
              href="mailto:personal.ilyasskrichi@gmail.com"
            >personal.ilyasskrichi@gmail.com</a>
          </p>
        </li>
      </ul>
      <p>
        If you have any feedback or want to say hello, feel free to reach out on any of the above!
      </p>
      <p>Happy note-taking!</p>
    `;

    const encryptedTitle = await encryptString("Welcome!");
    const encryptedContent = await encryptString(content);

    await prisma.note.create({
      data: {
        id: userId,
        title: encryptedTitle,
        body: encryptedContent,
        authorId: userId,
        pinned: true,
        createdAt: new Date(),
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const sendResetPasswordEmailAction = async (email: string) => {
  try {
    const { auth } = await createClient();

    const { data, error } = await auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
    });

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const resetPasswordAction = async (password: string) => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.updateUser({ password });

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updatePasswordAction = async (
  oldPassword: string,
  newPassword: string,
) => {
  try {
    const user = await getUser();

    if (!user)
      throw new Error("Please log in or sign up to update your password");

    const { auth } = await createClient();

    // Verify old password by attempting to sign in
    const { error: signInError } = await auth.signInWithPassword({
      email: user.email!,
      password: oldPassword,
    });

    if (signInError) {
      const errorMessage = signInError.message.toLowerCase();
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("incorrect") ||
        errorMessage.includes("wrong")
      ) {
        throw new Error("Current password is incorrect. Please try again.");
      }
      throw signInError;
    }

    // Update to new password
    const { error } = await auth.updateUser({
      password: newPassword,
      email: user.email,
    });

    if (error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("same") || errorMessage.includes("identical")) {
        throw new Error(
          "New password cannot be the same as your current password.",
        );
      }
      if (
        errorMessage.includes("weak") ||
        errorMessage.includes("password should")
      ) {
        throw new Error(
          "Password is too weak. Please use a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
        );
      }
      throw error;
    }

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
      throw new Error("Please log in or sign up to delete your account");

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

    if (!user) throw new Error("Please log in or sign up to get your API key");

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

    if (!user) throw new Error("Please log in or sign up to upload an avatar");

    const avatar = formData.get("avatar") as File;

    if (avatar.size >= 1024 * 1024 * 2)
      throw new Error("Avatar size must be less or equal to 2MB");

    const fileExtension = avatar.name.split(".").pop();

    const filePath = `${user.id}.${fileExtension}`;

    const { data: existingAvatar, error: existingAvatarError } = await storage
      .from("avatars")
      .list("", { search: user.id });
    if (existingAvatarError) throw existingAvatarError;
    if (existingAvatar?.length > 0)
      await storage.from("avatars").remove([existingAvatar[0].name]);

    const { error } = await storage.from("avatars").upload(filePath, avatar, {
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

    if (!user)
      throw new Error("Please log in or sign up to update your avatar");

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

    if (!user)
      throw new Error("Please log in or sign up to delete your avatar");

    const { data: existingAvatar, error: listError } = await storage
      .from("avatars")
      .list("", { search: user.id });
    if (listError) throw listError;
    const fileToDelete = existingAvatar[0].name;
    if (!fileToDelete) throw new Error("Avatar file not found for deletion");

    const { error } = await storage.from("avatars").remove([fileToDelete]);

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
      throw new Error("Please log in or sign up to update your profile");

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
      throw new Error("Please log in or sign up to update your API key");

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
