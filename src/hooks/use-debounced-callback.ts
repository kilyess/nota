import { debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";

export function useDebouncedCallback<Args extends any[] = any[], Return = void>(
  callback: (...args: Args) => Return,
  delay: number,
) {
  const callbackRef = useRef<(...args: Args) => Return>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(
    () => debounce((...args: Args) => callbackRef.current(...args), delay),
    [delay],
  );
}
