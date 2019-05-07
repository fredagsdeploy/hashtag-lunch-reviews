import { useRef, useState, useEffect } from "react";

export const useHideOnScrollDown = () => {
  const hasScrolled = useRef(false);
  const lastScrollY = useRef(0);

  const [hide, setHide] = useState(false);

  useEffect(() => {
    const eventListener = () => {
      hasScrolled.current = true;
    };

    window.addEventListener("scroll", eventListener);

    const animationFrameCallback = () => {
      if (hasScrolled.current) {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current) {
          setHide(true);
        } else {
          setHide(false);
        }

        lastScrollY.current = currentScrollY;
        hasScrolled.current = false;
      }

      window.requestAnimationFrame(animationFrameCallback);
    };

    window.requestAnimationFrame(animationFrameCallback);

    return () => {
      window.removeEventListener("scroll", eventListener);
    };
  }, []);

  return hide;
};
