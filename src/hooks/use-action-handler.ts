"use client";

import { useTransition } from "react";
import { toast } from "sonner";

type ActionResult = {
  errorMessage?: string | null;
  [key: string]: any;
};

type ActionHandlerOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  loadingMessage?: string;
  successMessage?: string;
  successDescription?: string;
  errorMessage?: string;
  errorDescription?: string;
};

export function useActionHandler<
  T extends (...args: any[]) => Promise<ActionResult>,
>(action: T) {
  const [isPending, startTransition] = useTransition();

  const handler = async (
    options: ActionHandlerOptions<Awaited<ReturnType<T>>> = {},
    ...args: Parameters<T> | []
  ) => {
    startTransition(() => {
      const promise = new Promise<Awaited<ReturnType<T>>>(
        async (resolve, reject) => {
          const result = await action(...args);
          if (result.errorMessage) {
            reject(new Error(result.errorMessage));
          } else {
            resolve(result as unknown as Awaited<ReturnType<T>>);
          }
        },
      );

      toast.promise(promise, {
        loading: options.loadingMessage || "Processing...",
        success: (data) => {
          options.onSuccess?.(data);
          return {
            message: options.successMessage || "Action completed successfully",
            description:
              options.successDescription || "Action completed successfully",
          };
        },
        error: (error) => {
          options.onError?.(error);
          return {
            message: options.errorMessage || "Action failed",
            description: options.errorDescription || error.message,
          };
        },
      });
    });
  };

  return { handler, isPending };
}
