// hooks/use-scroll-fade.ts
import { useEffect, useState } from "react";

export const useScrollFade = (selector: string) => {
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  useEffect(() => {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (!element) return;

    const updateFades = () => {
      const atTop = element.scrollTop <= 0;
      const atBottom =
        Math.ceil(element.scrollTop + element.clientHeight) >=
        element.scrollHeight;
      setShowTopFade(!atTop);
      setShowBottomFade(!atBottom);
    };

    updateFades(); // Initial check
    element.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);

    return () => {
      element.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, [selector]);

  return { showTopFade, showBottomFade };
};
