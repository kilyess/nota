import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  const errorString = String(error);

  const detailRegex = /detail: Some\("([^"]+)"\)/;
  const match = errorString.match(detailRegex);

  if (match && match[1]) {
    return {
      errorMessage: match[1],
    };
  }
  if (error instanceof Error) {
    return { errorMessage: error.message };
  } else {
    return { errorMessage: "An unexpected error occured." };
  }
};
