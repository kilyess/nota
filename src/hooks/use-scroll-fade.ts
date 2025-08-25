import { RefObject, useEffect, useState } from "react";

interface UseScrollFadeOptions {
  threshold?: number;
}

interface UseScrollFadeReturn {
  showTopFade: boolean;
  showBottomFade: boolean;
}

export function useScrollFade(
  elementRef: RefObject<HTMLElement>,
  options: UseScrollFadeOptions = {},
): UseScrollFadeReturn {
  const { threshold = 10 } = options;

  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;

      setShowTopFade(scrollTop > threshold);

      setShowBottomFade(scrollTop + clientHeight < scrollHeight - threshold);
    };

    handleScroll();

    element.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(element);

    const handleWindowResize = () => {
      setTimeout(handleScroll, 10);
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [elementRef, threshold]);

  return {
    showTopFade,
    showBottomFade,
  };
}
