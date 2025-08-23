"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import clsx from "clsx";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isMobile]);

  const handleToggle = () => {
    if (!isMobile) {
      setOpen((s) => !s);
    }
  };

  return (
    <div
      className={clsx(
        "pointer-events-none fixed top-4 left-4 z-30 rounded-lg p-1 transition-colors",
        "flex items-center space-x-1",
        open ? "bg-sidebar/50 backdrop-blur-sm" : "bg-transparent ring-0",
      )}
    >
      <div
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={open ? "Close actions" : "Open actions"}
        className="pointer-events-auto transition-transform duration-200 ease-in-out"
      >
        <SidebarTrigger className="size-8" />
      </div>

      <div className="flex items-center">
        <div
          className={clsx(
            "pointer-events-auto origin-left transform transition-all duration-300 ease-in-out",
            open
              ? "translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-2 opacity-0",
          )}
          style={{ transitionDelay: open ? "75ms" : "0ms" }}
        >
          <Button variant="ghost" size="sm" aria-hidden={!open}>
            <SearchIcon />
          </Button>
        </div>

        <div
          className={clsx(
            "pointer-events-auto origin-left transform transition-all duration-300 ease-in-out",
            open
              ? "translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-2 opacity-0",
          )}
          style={{ transitionDelay: open ? "150ms" : "0ms" }}
        >
          <Button variant="ghost" size="sm" aria-hidden={!open}>
            <PlusIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
