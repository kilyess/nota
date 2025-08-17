"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On server and during initial hydration we render this placeholder.
  // It must match server HTML to avoid hydration mismatch.
  if (!mounted) {
    return <div className="h-8 w-32" aria-hidden />;
  }

  const src =
    resolvedTheme === "dark" ? "/NOTA (Dark).png" : "/NOTA (Light).png";

  return (
    <Image
      src={src}
      alt="Logo"
      width={70}
      height={140}
      className="object-contain"
      priority
    />
  );
}
