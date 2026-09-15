import Link from "next/link";
import Image from "next/image";

export function DetailHeader({
  backHref,
  backLabel,
  kicker,
  title,
  dek,
  meta,
  coverUrl,
  coverAlt,
}: {
  backHref: string;
  backLabel: string;
  kicker: string;
  title: string;
  dek?: string;
  meta?: { authorInitials: string; author: string; date: string; read: string };
  coverUrl?: string | null;
  coverAlt?: string;
}) {
  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 pt-5.5">
        <Link
          href={backHref}
          className="no-underline font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-faint)] hover:text-[var(--color-accent)]"
        >
          ← {backLabel}
        </Link>
      </div>

      <header className="max-w-[1280px] mx-auto px-6 pt-6.5 pb-2">
        <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--color-accent-strong)" }}>
          {kicker}
        </span>
        <h1
          className="font-[family-name:var(--font-display)] font-extrabold m-0 mt-3.5 mb-4 text-[var(--color-ink)] max-w-[820px]"
          style={{ fontSize: "clamp(30px,4.6vw,54px)", lineHeight: 1.04, letterSpacing: "-1.5px" }}
        >
          {title}
        </h1>
        {dek && (
          <p className="m-0 mb-5.5 text-[var(--color-ink-soft)] max-w-[820px]" style={{ fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.5 }}>
            {dek}
          </p>
        )}
        {meta && (
          <div className="flex items-center gap-3 flex-wrap py-4 border-t border-b border-[var(--color-border)]">
            <span className="w-9 h-9 rounded-full bg-[var(--color-ink)] text-white grid place-items-center font-[family-name:var(--font-display)] font-bold text-[13px]">
              {meta.authorInitials}
            </span>
            <span className="text-sm font-semibold">{meta.author}</span>
            <span className="ml-auto font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-faint-2)]">
              {meta.date} · {meta.read}
            </span>
          </div>
        )}
      </header>

      {coverUrl && (
        <div className="max-w-[1120px] mx-auto px-6 mt-8">
          <div className="relative w-full rounded-md overflow-hidden border border-[var(--color-border)]" style={{ aspectRatio: "16/7" }}>
            <Image src={coverUrl} alt={coverAlt || title} fill className="object-cover" priority />
          </div>
        </div>
      )}
    </>
  );
}
