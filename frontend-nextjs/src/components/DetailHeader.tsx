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
  const backLink = (
    <Link
      href={backHref}
      className="no-underline font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-faint)] hover:text-[var(--color-accent)]"
    >
      ← {backLabel}
    </Link>
  );

  if (coverUrl) {
    return (
      <>
        <div className="max-w-[1280px] mx-auto px-6 pt-5.5">{backLink}</div>

        <div
          className="relative w-full mt-6.5 overflow-hidden"
          style={{ height: "clamp(280px, 45vh, 560px)" }}
        >
          <Image src={coverUrl} alt={coverAlt || title} fill className="object-cover" priority />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 100%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 max-w-[1280px] mx-auto px-6 pb-8">
            <span
              className="inline-block font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-white px-2.5 py-1 rounded-sm backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              {kicker}
            </span>
            <h1
              className="font-[family-name:var(--font-display)] font-extrabold m-0 mt-3.5 text-white max-w-[820px]"
              style={{ fontSize: "clamp(28px,4.6vw,54px)", lineHeight: 1.04, letterSpacing: "-1.5px" }}
            >
              {title}
            </h1>
            {dek && (
              <p
                className="m-0 mt-3 max-w-[820px]"
                style={{ fontSize: "clamp(15px,2vw,19px)", lineHeight: 1.5, color: "rgba(255,255,255,0.88)" }}
              >
                {dek}
              </p>
            )}
          </div>
        </div>

        {meta && (
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-center gap-3 flex-wrap py-4 border-b border-[var(--color-border)]">
              <span className="w-9 h-9 rounded-full bg-[var(--color-ink)] text-white grid place-items-center font-[family-name:var(--font-display)] font-bold text-[13px]">
                {meta.authorInitials}
              </span>
              <span className="text-sm font-semibold">{meta.author}</span>
              <span className="ml-auto font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-faint-2)]">
                {meta.date} · {meta.read}
              </span>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 pt-5.5">{backLink}</div>

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
    </>
  );
}
