"use client";

import { useCallback, useEffect, useId, useRef, useState, type ImgHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

function ImagePreview({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <dialog ref={dialog} className="image-preview" aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <h2 id={titleId} className="sr-only">Image preview: {alt || "Article image"}</h2>
      <button type="button" className="image-preview-close ui-icon-button" onClick={onClose}
        aria-label="Close image preview" title="Close (Esc)"><Icon name="close" /></button>
      <figure className="image-preview-figure">
        {failed ? <p role="status" className="ui-surface p-6 text-ink">Image unavailable. Close the preview and try again.</p> : (
          <button type="button" className="image-preview-image" onClick={onClose} aria-label="Close enlarged image">
            {/* Article images may come from arbitrary hosts; preserve their original URLs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} onError={() => setFailed(true)} />
          </button>
        )}
        {alt && <figcaption>{alt}</figcaption>}
        <p className="image-preview-hint">Click outside the image or press Esc to close</p>
      </figure>
    </dialog>, document.body,
  );
}

export default function ZoomableImage({ src, alt = "", className = "", ...props }: ImageProps) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }, []);
  if (typeof src !== "string" || !src) return null;

  return (
    <>
      <button ref={trigger} type="button" className="article-image-trigger" aria-haspopup="dialog"
        aria-label={`Enlarge image: ${alt || "Article image"}`} onClick={() => setOpen(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...props} src={src} alt={alt} className={className} loading={props.loading || "lazy"} />
        <span className="article-image-hint"><Icon name="zoom" /> Enlarge</span>
      </button>
      {open && <ImagePreview src={src} alt={alt} onClose={close} />}
    </>
  );
}
