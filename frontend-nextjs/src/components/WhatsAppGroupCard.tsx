import Image from "next/image";
import type { StrapiImage } from "@/src/types/strapi";
import { getStrapiMedia } from "@/src/lib/strapi";

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2C6.5 2 2 6.5 2 12.04c0 1.77.46 3.5 1.34 5.02L2 22l5.1-1.32a10 10 0 0 0 4.94 1.26h.01C17.58 21.94 22 17.44 22 11.9 22 9.22 20.96 6.7 19.07 4.8A9.93 9.93 0 0 0 12.04 2z" />
    </svg>
  );
}

export function WhatsAppGroupCard({ qrcode, url }: { qrcode: StrapiImage | null; url: string | null }) {
  const src = getStrapiMedia(qrcode?.url);

  const content = (
    <>
      {src ? (
        <div className="relative flex-none w-28 h-28 rounded-[5px] overflow-hidden border border-[var(--color-border)] bg-white">
          <Image src={src} alt={qrcode?.alternativeText || "QR code do grupo oficial de WhatsApp"} fill className="object-contain" />
        </div>
      ) : (
        <div className="flex-none w-28 h-28 rounded-[5px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] flex items-center justify-center text-[#25D366]">
          <WhatsAppLogo className="w-14 h-14" />
        </div>
      )}
      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5">
          <span className="flex-none w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
            <WhatsAppLogo className="w-3 h-3" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#128C7E]">
            WhatsApp
          </span>
        </span>
        <h3 className="font-[family-name:var(--font-display)] font-bold text-lg leading-snug tracking-[-0.4px] mt-1.5 mb-1.5 text-[var(--color-ink)]">
          Grupo oficial
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-muted)] m-0">
          {url
            ? src
              ? "Escaneie o QR code ou toque para entrar."
              : "Toque para entrar no grupo."
            : "Em breve."}
        </p>
      </div>
    </>
  );

  const className =
    "no-underline flex items-center gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md p-4 text-inherit";

  if (!url) return <div className={className}>{content}</div>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition-colors duration-200 hover:border-[#25D366]`}
    >
      {content}
    </a>
  );
}
