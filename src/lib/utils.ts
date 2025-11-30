import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  const errorString = String(error);

  // Extract message from error object if it exists
  let message: string | undefined;
  if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  }

  // If no message found, try to extract from string representation
  if (!message) {
    const detailRegex = /message: "([^"]+)"/;
    const match = errorString.match(detailRegex);
    message = match && match[1] ? match[1] : undefined;
  }

  // Normalize message to lowercase for comparison
  const normalizedMessage = message?.toLowerCase() || "";
  const normalizedErrorString = errorString.toLowerCase();

  // Check for duplicate email/user errors
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

  // Check for invalid login credentials
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

  // Check for email not confirmed
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

  // Check for weak password
  if (
    normalizedMessage.includes("password is too weak") ||
    normalizedMessage.includes("password should be")
  ) {
    return {
      errorMessage:
        "Password is too weak. Please use a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
    };
  }

  // Check for rate limiting
  if (
    normalizedMessage.includes("too many requests") ||
    normalizedMessage.includes("rate limit") ||
    normalizedErrorString.includes("rate limit")
  ) {
    return {
      errorMessage: "Too many requests. Please wait a moment and try again.",
    };
  }

  // Check for database errors
  if (normalizedErrorString.includes("database error saving new user")) {
    return {
      errorMessage:
        "We've reached the daily signup limit, or signup is currently disabled. Please try again later.",
    };
  }

  // Return extracted message if available
  if (message) {
    return {
      errorMessage: message,
    };
  }

  // Fallback for unknown errors
  if (error instanceof Error) {
    return { errorMessage: error.message };
  } else {
    return { errorMessage: "An unexpected error occurred." };
  }
};
