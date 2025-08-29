import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  const errorString = String(error);

  const detailRegex = /message: "([^"]+)"/;
  const match = errorString.match(detailRegex);
  const message = match && match[1] ? match[1] : undefined;

  if (message) {
    return {
      errorMessage: message,
    };
  }

  if (errorString.includes("Database error saving new user")) {
    return {
      errorMessage:
        "We've reached the daily signup limit, or signup is currently disabled. Please try again later.",
    };
  }

  if (error instanceof Error) {
    return { errorMessage: error.message };
  } else {
    return { errorMessage: "An unexpected error occured." };
  }
};
