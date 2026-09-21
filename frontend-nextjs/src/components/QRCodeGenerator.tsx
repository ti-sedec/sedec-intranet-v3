"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

type Mode = "url" | "contact";

const INPUT_CLASS =
  "w-full px-3 py-2.5 rounded border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)]";

const escapeVCard = (v: string) =>
  v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\;").replace(/,/g, "\\,");

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

function buildVCard(c: { name: string; phone: string; email: string; org: string }): string | null {
  const name = c.name.trim();
  const phone = c.phone.replace(/[^\d+]/g, "");
  if (!name || phone.replace(/\D/g, "").length < 8) return null;
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${escapeVCard(name)}`, `N:${escapeVCard(name)};;;;`];
  if (c.org.trim()) lines.push(`ORG:${escapeVCard(c.org.trim())}`);
  lines.push(`TEL;TYPE=CELL:${phone}`);
  if (c.email.trim()) lines.push(`EMAIL:${escapeVCard(c.email.trim())}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

export default function QRCodeGenerator() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "", email: "", org: "" });
  const [rendered, setRendered] = useState<{ content: string; png: string } | null>(null);

  const content = useMemo(
    () => (mode === "url" ? normalizeUrl(url) : buildVCard(contact)),
    [mode, url, contact]
  );

  const png = content && rendered?.content === content ? rendered.png : null;

  useEffect(() => {
    if (!content) return;
    let cancelled = false;
    QRCode.toDataURL(content, { errorCorrectionLevel: "M", width: 512, margin: 2 })
      .then((d) => !cancelled && setRendered({ content, png: d }))
      .catch(() => !cancelled && setRendered(null));
    return () => {
      cancelled = true;
    };
  }, [content]);

  const downloadSvg = async () => {
    if (!content) return;
    const svg = await QRCode.toString(content, { type: "svg", errorCorrectionLevel: "M", margin: 2 });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const setField = (k: keyof typeof contact) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setContact((c) => ({ ...c, [k]: e.target.value }));

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`px-4 py-2.5 rounded text-sm font-semibold ${
        mode === m
          ? "bg-[var(--color-ink)] text-white"
          : "text-[var(--color-ink)] hover:bg-[#ebe7df]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-6">
        <div className="flex gap-2 mb-6">
          {tab("url", "URL")}
          {tab("contact", "Contato telefônico")}
        </div>

        {mode === "url" ? (
          <label className="block">
            <span className="block text-[13px] font-semibold mb-1.5">Endereço (URL)</span>
            <input
              type="text"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com.br"
              className={INPUT_CLASS}
            />
            {url.trim() && !content && (
              <span className="block text-xs text-[var(--color-accent-strong)] mt-1.5">
                Informe uma URL válida.
              </span>
            )}
          </label>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="block text-[13px] font-semibold mb-1.5">Nome *</span>
              <input type="text" value={contact.name} onChange={setField("name")} className={INPUT_CLASS} />
            </label>
            <label className="block">
              <span className="block text-[13px] font-semibold mb-1.5">Telefone *</span>
              <input
                type="tel"
                value={contact.phone}
                onChange={setField("phone")}
                placeholder="+55 11 91234-5678"
                className={INPUT_CLASS}
              />
            </label>
            <label className="block">
              <span className="block text-[13px] font-semibold mb-1.5">E-mail</span>
              <input type="email" value={contact.email} onChange={setField("email")} className={INPUT_CLASS} />
            </label>
            <label className="block">
              <span className="block text-[13px] font-semibold mb-1.5">Organização</span>
              <input type="text" value={contact.org} onChange={setField("org")} className={INPUT_CLASS} />
            </label>
            <p className="sm:col-span-2 text-xs text-[var(--color-muted)] m-0">
              Ao escanear, o celular oferece salvar o contato na agenda.
            </p>
          </div>
        )}
      </div>

      <aside className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-2 border-t-[var(--color-accent)] rounded p-6 flex flex-col items-center gap-4">
        <div className="w-full aspect-square grid place-items-center bg-white border border-[var(--color-border)] rounded">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={png} alt="QR Code gerado" className="w-full h-full" />
          ) : (
            <span className="text-sm text-[var(--color-faint)] px-6 text-center">
              Preencha os campos para gerar o QR Code.
            </span>
          )}
        </div>
        <div className="flex gap-2 w-full">
          <a
            aria-disabled={!png}
            href={png ?? undefined}
            download="qrcode.png"
            className={`flex-1 inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white px-4 py-2.5 rounded text-[13px] font-semibold no-underline hover:bg-[var(--color-accent)] hover:text-white ${
              png ? "" : "opacity-40 pointer-events-none"
            }`}
          >
            <Download size={14} /> PNG
          </a>
          <button
            type="button"
            onClick={downloadSvg}
            disabled={!png}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-[var(--color-ink)] text-[var(--color-ink)] px-4 py-2.5 rounded text-[13px] font-semibold hover:bg-[#ebe7df] disabled:opacity-40 disabled:pointer-events-none"
          >
            <Download size={14} /> SVG
          </button>
        </div>
      </aside>
    </div>
  );
}
