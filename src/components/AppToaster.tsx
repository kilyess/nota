"use client";

import {
  AlertCircle,
  AlertTriangle,
  CircleCheckBig,
  Info,
  Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function AppToaster() {
  const { theme, systemTheme } = useTheme();
  const effective = (theme === "system" ? systemTheme : theme) as
    | "light"
    | "dark"
    | undefined;

  return (
    <Toaster
      theme={effective ?? "system"}
      duration={4000}
      icons={{
        loading: <Loader2 className="size-4 animate-spin" />,
        success: <CircleCheckBig className="size-4" />,
        error: <AlertCircle className="size-4" />,
        info: <Info className="size-4" />,
        warning: <AlertTriangle className="size-4" />,
      }}
      richColors
    />
  );
}
