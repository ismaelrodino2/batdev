import type { ReactNode } from "react";
import Image from "next/image";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  /** Decorative artwork behind the masthead. Text switches to a fixed light
   *  palette when set, since the image is dark in both themes. */
  image?: string;
  /** CSS object-position. The same artwork is reused across pages, so each one
   *  frames a different part of it rather than repeating the identical shot. */
  imagePosition?: string;
  /** Shorter band — for index pages, where the list is the point. */
  compact?: boolean;
};

/** The centred masthead BatDev has always opened with: small caps label, big
 *  extrabold title, short rule underneath. */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  image,
  imagePosition = "center",
  compact = false
}: Props) {
  const onArt = Boolean(image);

  const padding = onArt && !compact ? "py-24 sm:py-32" : "py-16 sm:py-20";

  return (
    <div
      className={`relative isolate overflow-hidden border-b border-line ${
        onArt ? "" : "bg-card"
      }`}
    >
      {image && (
        <>
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            style={{ objectPosition: imagePosition }}
            className="-z-20 object-cover"
          />
          <div className="art-scrim absolute inset-0 -z-10" />
          <div className="art-fade absolute inset-x-0 bottom-0 -z-10 h-2/5" />
        </>
      )}

      <div className={`mx-auto max-w-2xl px-5 text-center sm:px-8 ${padding}`}>
        {eyebrow && (
          <p
            className={`mb-3 text-[11px] font-extrabold uppercase tracking-label ${
              onArt ? "text-accent-bright" : "text-accent"
            }`}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className={`text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl ${
            onArt ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]" : ""
          }`}
        >
          {title}
        </h1>

        <hr
          className={`mx-auto mt-7 w-10 border-0 border-t-2 ${
            onArt ? "border-white/40" : "border-line-strong"
          }`}
        />

        {lead && (
          <p
            className={`mt-7 text-pretty leading-relaxed ${
              onArt ? "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]" : "text-muted"
            }`}
          >
            {lead}
          </p>
        )}
      </div>
    </div>
  );
}
