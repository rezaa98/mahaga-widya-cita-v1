import React from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";

type Props = {
  content: any;
  className?: string;
};

type UploadDocument = {
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
  filename?: string | null;
  height?: number | null;
  mimeType?: string | null;
  sizes?: Record<
    string,
    {
      height?: number | null;
      mimeType?: string | null;
      url?: string | null;
      width?: number | null;
    } | null
  > | null;
  url?: string | null;
  width?: number | null;
};

function renderUploadedMedia(node: any) {
  const media = typeof node?.value === "object" && node.value ? (node.value as UploadDocument) : null;

  if (!media?.url) {
    return null;
  }

  const alt = node?.fields?.alt || media.alt || "Gambar pada artikel";
  const caption = node?.fields?.caption || media.caption;
  const credit = node?.fields?.credit || media.credit;
  const isImage = media.mimeType?.startsWith("image/");

  if (!isImage) {
    return (
      <a className="rich-text__file-link" href={media.url} rel="noopener noreferrer" target="_blank">
        {media.filename || "Unduh dokumen"}
      </a>
    );
  }

  const tablet = media.sizes?.tablet;
  const card = media.sizes?.card;

  return (
    <figure className="rich-text__media">
      <picture>
        {card?.url && card.mimeType && <source media="(max-width: 768px)" srcSet={card.url} type={card.mimeType} />}
        {tablet?.url && tablet.mimeType && (
          <source media="(max-width: 1024px)" srcSet={tablet.url} type={tablet.mimeType} />
        )}
        <img
          alt={alt}
          height={media.height || undefined}
          loading="lazy"
          src={media.url}
          width={media.width || undefined}
        />
      </picture>
      {(caption || credit) && (
        <figcaption>
          {caption}
          {caption && credit ? " — " : ""}
          {credit && <span className="rich-text__media-credit">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export default function RichTextRenderer({ content, className = "" }: Props) {
  if (!content) return null;

  return (
    <div className={`rich-text ${className}`}>
      <RichText
        data={content}
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          upload: ({ node }) => renderUploadedMedia(node),
        })}
      />
    </div>
  );
}
