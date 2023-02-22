import DOMPurify from "dompurify";


export const sanitize = (content) => {
    const isBrowser = typeof window !== 'undefined';
    return isBrowser ? DOMPurify.sanitize(content) : content;
  };