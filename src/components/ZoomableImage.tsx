"use client";

import { useCallback, useEffect, useId, useRef, useState, type ImgHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import { useWorldLocale } from "./world/WorldProvider";

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

function ImagePreview({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const { t } = useWorldLocale();
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
      <h2 id={titleId} className="sr-only">{t("图片预览：", "Image preview: ")}{alt || t("文章配图", "Article image")}</h2>
      <button type="button" className="image-preview-close ui-icon-button" onClick={onClose}
        aria-label={t("关闭图片预览", "Close image preview")} title={t("关闭（Esc）", "Close (Esc)")}><Icon name="close" /></button>
      <figure className="image-preview-figure">
        {failed ? <p role="status" className="ui-surface p-6 text-ink">{t("图片暂时无法加载，请关闭预览后重试。", "Image unavailable. Close the preview and try again.")}</p> : (
          <button type="button" className="image-preview-image" onClick={onClose} aria-label={t("关闭放大图片", "Close enlarged image")}>
            {/* Article images may come from arbitrary hosts; preserve their original URLs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} onError={() => setFailed(true)} />
          </button>
        )}
        {alt && <figcaption>{alt}</figcaption>}
        <p className="image-preview-hint">{t("点击图片外部或按 Esc 关闭", "Click outside the image or press Esc to close")}</p>
      </figure>
    </dialog>, document.body,
  );
}

export default function ZoomableImage({ src, alt = "", className = "", ...props }: ImageProps) {
  const { t } = useWorldLocale();
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
        aria-label={`${t("放大图片：", "Enlarge image: ")}${alt || t("文章配图", "Article image")}`} onClick={() => setOpen(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...props} src={src} alt={alt} className={className} loading={props.loading || "lazy"} />
        <span className="article-image-hint"><Icon name="zoom" /> {t("放大", "Enlarge")}</span>
      </button>
      {open && <ImagePreview src={src} alt={alt} onClose={close} />}
    </>
  );
}
