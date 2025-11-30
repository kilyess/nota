import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  const errorString = String(error);

  let message: string | undefined;
  if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  }

  if (!message) {
    const detailRegex = /message: "([^"]+)"/;
    const match = errorString.match(detailRegex);
    message = match && match[1] ? match[1] : undefined;
  }

  const normalizedMessage = message?.toLowerCase() || "";
  const normalizedErrorString = errorString.toLowerCase();
  if (
    normalizedMessage.includes("user already registered") ||
    normalizedMessage.includes("email already registered") ||
    normalizedMessage.includes("user already exists") ||
    normalizedMessage.includes("email address is already in use") ||
    normalizedErrorString.includes("unique constraint") ||
    normalizedErrorString.includes("duplicate key")
  ) {
    return {
      errorMessage:
        "An account with this email already exists. Please log in instead or use a different email address.",
    };
  }

  if (
    normalizedMessage.includes("invalid login credentials") ||
    normalizedMessage.includes("invalid password") ||
    normalizedMessage.includes("incorrect password") ||
    normalizedMessage.includes("wrong password")
  ) {
    return {
      errorMessage:
        "Invalid email or password. Please check your credentials and try again.",
    };
  }

  if (
    normalizedMessage.includes("email not confirmed") ||
    normalizedMessage.includes("email not verified") ||
    normalizedMessage.includes("confirmation required")
  ) {
    return {
      errorMessage:
        "Please verify your email address before logging in. Check your inbox for the confirmation link.",
    };
  }

  if (
    normalizedMessage.includes("password is too weak") ||
    normalizedMessage.includes("password should be")
  ) {
    return {
      errorMessage:
        "Password is too weak. Please use a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
    };
  }

  if (
    normalizedMessage.includes("too many requests") ||
    normalizedMessage.includes("rate limit") ||
    normalizedErrorString.includes("rate limit")
  ) {
    return {
      errorMessage: "Too many requests. Please wait a moment and try again.",
    };
  }

  if (normalizedErrorString.includes("database error saving new user")) {
    return {
      errorMessage:
        "We've reached the daily signup limit, or signup is currently disabled. Please try again later.",
    };
  }

  if (message) {
    return {
      errorMessage: message,
    };
  }

  if (error instanceof Error) {
    return { errorMessage: error.message };
  } else {
    return { errorMessage: "An unexpected error occurred." };
  }
};
