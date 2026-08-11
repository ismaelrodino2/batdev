import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
};

/** The centred masthead BatDev has always opened with: small caps label, big
 *  extrabold title, short rule underneath. */
export default function PageHeader({ eyebrow, title, lead }: Props) {
  return (
    <div className="border-b border-line bg-card">
      <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 sm:py-20">
        {eyebrow && (
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-label text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <hr className="mx-auto mt-7 w-10 border-0 border-t-2 border-line-strong" />
        {lead && <p className="mt-7 text-pretty leading-relaxed text-muted">{lead}</p>}
      </div>
    </div>
  );
}
