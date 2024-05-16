import { useEffect } from 'react';

export const useOnClickOutside = <TElement extends HTMLElement>(
  ref: React.MutableRefObject<TElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref?.current && !ref.current?.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref]);
};
