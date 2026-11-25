"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw } from "lucide-react";

const NAVY = "#193282";
const LINE_COLOR = "#adb5bd";
const FONT = "Arial, Helvetica, sans-serif";

const DEFAULT_ADDRESS =
  "Rua Engº Edgard Prado, s/nº - Centro Político Administrativo\nCuiabá/MT, CEP: 78.049-910";

// Geometria lógica (px). O canvas é desenhado em SCALE× para ficar nítido em telas retina.
const W = 600;
const SCALE = 2;
const BLOCK_W = W * 0.4; // coluna esquerda (nome + telefone): 40% da largura; o resto (60%) é logo + endereço
const TOP_H = 70;
const LINE_H = 3;
const BOTTOM_TOP = TOP_H + LINE_H;
const MIN_BOTTOM_H = 32;
const RADIUS = 6;
const RIGHT_X = BLOCK_W + 6; // o endereço começa logo após o bloco azul
const RIGHT_END = 593;
const LOGO_W = 232; // logo alinhada à direita da seção
const LOGO_RATIO = 31899 / 8128.4;
const ADDR_LINE_H = 13.5;
const ADDR_SIZES = [11.5, 10.5, 9.5, 8.5];
const MAX_WRAPPED_LINES = 4;
const REFLECTION_H = 28;
const MAX_ADDRESS_LINES = 3;

const INPUT_CLASS =
  "w-full px-3 py-2.5 rounded border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)]";

type Fields = { name: string; role: string; phone: string; address: string };

/** Menor tamanho de fonte (entre max e min) em que o texto cabe em maxW. */
function fitSize(ctx: CanvasRenderingContext2D, text: string, maxW: number, max: number, min: number) {
  let size = max;
  while (size > min) {
    ctx.font = `bold ${size}px ${FONT}`;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 0.5;
  }
  ctx.font = `bold ${size}px ${FONT}`;
  return size;
}

function ellipsize(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

/** Quebra em até maxLines linhas (a fonte deve estar definida no ctx). */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number) {
  const lines: string[] = [];
  let current = "";
  const words = text.split(/\s+/).filter(Boolean);
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || ctx.measureText(candidate).width <= maxW) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  const kept = lines.slice(0, maxLines);
  if (lines.length > maxLines) kept[maxLines - 1] = `${kept[maxLines - 1]}…`;
  return kept.map((l) => ellipsize(ctx, l, maxW));
}

/** Retângulo com cantos arredondados apenas no lado esquerdo (cantos externos da assinatura). */
function leftRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  round: { top: boolean; bottom: boolean }
) {
  ctx.beginPath();
  ctx.moveTo(x + (round.top ? r : 0), y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + (round.bottom ? r : 0), y + h);
  if (round.bottom) ctx.arcTo(x, y + h, x, y + h - r, r);
  else ctx.lineTo(x, y + h);
  if (round.top) {
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
  } else {
    ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawSignature(canvas: HTMLCanvasElement, fields: Fields, logo: HTMLImageElement | null) {
  // Medição prévia (o tamanho do canvas depende de quantas linhas o endereço ocupa)
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) return;
  const addrW = RIGHT_END - RIGHT_X;
  const rawLines = fields.address
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, MAX_ADDRESS_LINES);
  let addrSize = ADDR_SIZES[0];
  let addrLines: string[] = [];
  for (const size of ADDR_SIZES) {
    addrSize = size;
    measure.font = `bold ${size}px ${FONT}`;
    addrLines = rawLines.flatMap((l) => wrap(measure, l, addrW, 10));
    if (addrLines.length <= MAX_WRAPPED_LINES) break;
  }
  if (addrLines.length > MAX_WRAPPED_LINES) {
    addrLines = addrLines.slice(0, MAX_WRAPPED_LINES);
    addrLines[MAX_WRAPPED_LINES - 1] = ellipsize(measure, `${addrLines[MAX_WRAPPED_LINES - 1]}…`, addrW);
  }

  const bottomH = Math.max(MIN_BOTTOM_H, addrLines.length * ADDR_LINE_H + 14);
  const axisY = BOTTOM_TOP + bottomH + 1;
  const H = axisY + REFLECTION_H;

  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(SCALE, SCALE);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";

  // Seção superior: bloco azul com nome e cargo
  ctx.fillStyle = NAVY;
  leftRoundedRect(ctx, 0, 0, BLOCK_W, TOP_H, RADIUS, { top: true, bottom: false });
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  const textW = BLOCK_W - 20;
  const name = fields.name.trim() || "Nome Sobrenome";
  fitSize(ctx, name, textW, 17, 12);
  ctx.fillText(ellipsize(ctx, name, textW), 10, 27);
  const role = fields.role.trim() || "Cargo";
  fitSize(ctx, role, textW, 11.5, 10);
  wrap(ctx, role, textW, 2).forEach((line, i) => ctx.fillText(line, 10, 46 + i * 14));

  // Logo (coluna direita)
  if (logo) {
    const logoH = LOGO_W / LOGO_RATIO;
    ctx.drawImage(logo, RIGHT_END - LOGO_W, (TOP_H - logoH) / 2, LOGO_W, logoH);
  }

  // Linha divisória cinza entre as seções
  ctx.fillStyle = LINE_COLOR;
  ctx.fillRect(0, TOP_H, W, LINE_H);

  // Seção inferior: telefone (bloco azul) + endereço (coluna direita). Reutilizada no reflexo.
  const phone = fields.phone.trim();
  const drawBottom = (c: CanvasRenderingContext2D) => {
    c.textBaseline = "alphabetic";
    c.fillStyle = NAVY;
    leftRoundedRect(c, 0, BOTTOM_TOP, BLOCK_W, bottomH, RADIUS, { top: false, bottom: true });
    c.fill();
    if (phone) {
      c.fillStyle = "#ffffff";
      const size = fitSize(c, phone, BLOCK_W - 20, 13, 9);
      c.fillText(ellipsize(c, phone, BLOCK_W - 20), 10, BOTTOM_TOP + bottomH / 2 + size * 0.35);
    }
    c.fillStyle = NAVY;
    c.font = `bold ${addrSize}px ${FONT}`;
    const top = BOTTOM_TOP + (bottomH - addrLines.length * ADDR_LINE_H) / 2;
    addrLines.forEach((l, i) => c.fillText(l, RIGHT_X, top + i * ADDR_LINE_H + ADDR_LINE_H * 0.75));
  };
  drawBottom(ctx);

  // Reflexo: seção inferior espelhada em relação a axisY, esmaecendo para baixo
  const off = document.createElement("canvas");
  off.width = W * SCALE;
  off.height = H * SCALE;
  const octx = off.getContext("2d");
  if (!octx) return;
  octx.scale(SCALE, SCALE);
  octx.translate(0, axisY * 2);
  octx.scale(1, -1);
  drawBottom(octx);
  octx.setTransform(1, 0, 0, 1, 0, 0);
  octx.globalCompositeOperation = "destination-in";
  const start = axisY / H;
  const grad = octx.createLinearGradient(0, 0, 0, off.height);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(Math.max(0, start - 0.001), "rgba(0,0,0,0)");
  grad.addColorStop(start, "rgba(0,0,0,0.4)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  octx.fillStyle = grad;
  octx.fillRect(0, 0, off.width, off.height);
  ctx.drawImage(off, 0, 0, W, H);
}

export default function EmailSignatureGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fields, setFields] = useState<Fields>({ name: "", role: "", phone: "", address: DEFAULT_ADDRESS });
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLogo(img);
      setLogoLoaded(true);
    };
    img.onerror = () => setLogoLoaded(true); // desenha mesmo sem a logo
    img.src = "/logo-sedec.svg";
  }, []);

  useEffect(() => {
    if (!logoLoaded || !canvasRef.current) return;
    drawSignature(canvasRef.current, fields, logo);
  }, [fields, logo, logoLoaded]);

  const canDownload = logoLoaded && fields.name.trim() !== "" && fields.role.trim() !== "";

  const download = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "assinatura-sedec.png";
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };

  const setField =
    (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="grid gap-8">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="block text-[13px] font-semibold mb-1.5">Nome *</span>
            <input
              type="text"
              value={fields.name}
              onChange={setField("name")}
              placeholder="Nome Sobrenome"
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            <span className="block text-[13px] font-semibold mb-1.5">Cargo *</span>
            <input
              type="text"
              value={fields.role}
              onChange={setField("role")}
              placeholder="Coordenador de Tecnologia da Informação"
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            <span className="block text-[13px] font-semibold mb-1.5">Telefone</span>
            <input
              type="tel"
              value={fields.phone}
              onChange={setField("phone")}
              placeholder="65 99999-9999"
              className={INPUT_CLASS}
            />
          </label>
          <label className="block sm:row-span-1">
            <span className="flex items-center justify-between text-[13px] font-semibold mb-1.5">
              Endereço
              <button
                type="button"
                onClick={() => setFields((f) => ({ ...f, address: DEFAULT_ADDRESS }))}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)]"
              >
                <RotateCcw size={12} /> Restaurar padrão
              </button>
            </span>
            <textarea
              value={fields.address}
              onChange={setField("address")}
              rows={3}
              className={`${INPUT_CLASS} resize-y`}
            />
            <span className="block text-xs text-[var(--color-muted)] mt-1.5">
              Cada linha vira uma linha na assinatura (máximo de {MAX_ADDRESS_LINES}).
            </span>
          </label>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] border-t-2 border-t-[var(--color-accent)] rounded p-6">
        <div className="overflow-x-auto bg-white border border-[var(--color-border)] rounded p-4">
          <canvas ref={canvasRef} className="block h-auto" style={{ width: W, maxWidth: "100%" }} aria-label="Prévia da assinatura de e-mail" />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <button
            type="button"
            onClick={download}
            disabled={!canDownload}
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white px-5 py-2.5 rounded text-[13px] font-semibold hover:bg-[var(--color-accent)] disabled:opacity-40 disabled:pointer-events-none"
          >
            <Download size={14} /> Baixar PNG
          </button>
          {!canDownload && logoLoaded && (
            <span className="text-xs text-[var(--color-muted)]">Preencha nome e cargo para baixar.</span>
          )}
        </div>

        <details className="mt-6 text-sm text-[var(--color-body)]">
          <summary className="cursor-pointer font-semibold">Como usar no seu e-mail</summary>
          <ul className="mt-3 pl-5 list-disc grid gap-1.5">
            <li>
              <strong>Outlook:</strong> Arquivo → Opções → Email → Assinaturas → Nova, e insira a imagem baixada.
            </li>
            <li>
              <strong>Gmail:</strong> Configurações → Ver todas as configurações → Geral → Assinatura, e use o ícone de imagem.
            </li>
            <li>Por ser uma imagem, preencha o texto alternativo (alt) com seu nome e cargo, por acessibilidade.</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
