import { RefObject, useState, useEffect } from "react";
import _ from "lodash";

export const useCollapse = (
  allContentRef: RefObject<HTMLElement>,
  singleItemRef: RefObject<HTMLElement>
): [number, boolean, () => void] => {
  const [isOpen, setIsOpen] = useState(false);

  const [firstHeight, setFirstHeight] = useState(0);

  useEffect(() => {
    const listeners = _.debounce(() => {
      if (singleItemRef.current) {
        setFirstHeight(singleItemRef.current.clientHeight);
      }
      if (allContentRef.current) {
        setTotalheight(allContentRef.current.clientHeight);
      }
    }, 500);
    window.addEventListener("resize", listeners);

    return () => {
      window.removeEventListener("resize", listeners);
    };
  }, [singleItemRef, allContentRef]);

  useEffect(() => {
    if (singleItemRef.current) {
      setFirstHeight(singleItemRef.current.clientHeight);
    }
  }, [singleItemRef]);

  const [totalHeight, setTotalheight] = useState(0);
  useEffect(() => {
    if (allContentRef.current) {
      setTotalheight(allContentRef.current.clientHeight);
    }
  }, [allContentRef]);

  const height = isOpen ? totalHeight : firstHeight;

  const toggleIsOpen = () => {
    setIsOpen(open => !open);
  };

  return [height, isOpen, toggleIsOpen];
};
