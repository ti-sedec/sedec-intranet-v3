import type { Aniversariante } from "@/src/types/strapi";
import { initials, monthLabel } from "@/src/lib/format";
import { isChristmasSeason } from "@/src/lib/season";
import { ChristmasSnow } from "@/src/components/ChristmasSnow";
import { SpotlightSurface } from "@/src/components/SpotlightSurface";
import { Reveal } from "@/src/components/motion/Reveal";
import { stagger } from "@/src/lib/motion";

function isToday(dataAniversario: string, today: Date): boolean {
  const d = new Date(dataAniversario);
  return d.getUTCMonth() === today.getMonth() && d.getUTCDate() === today.getDate();
}

export function BirthdaysSection({ birthdays }: { birthdays: Aniversariante[] }) {
  const today = new Date();

  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] text-white mt-14 py-12">
      {isChristmasSeason(today) && <ChristmasSnow />}
      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="flex items-end gap-5 flex-wrap mb-7">
          <div>
            <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--color-accent-soft)" }}>
              Mural
            </span>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold m-0 mt-2" style={{ fontSize: "clamp(26px,3.4vw,40px)", letterSpacing: "-1px", lineHeight: 1 }}>
              Aniversariantes de {monthLabel(today)}
            </h2>
          </div>
          {birthdays.length > 0 && (
            <span className="text-sm text-[#a8adbb] ml-auto max-w-[34ch]">
              {birthdays.length} {birthdays.length === 1 ? "colega celebra" : "colegas celebram"} neste mês.
            </span>
          )}
        </div>
        {birthdays.length === 0 ? (
          <p className="text-sm text-[#8b90a0] m-0">Nenhum aniversariante neste mês.</p>
        ) : (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))" }}>
          {birthdays.map((b, i) => {
            const today_ = isToday(b.dataAniversario, today);
            const day = String(new Date(b.dataAniversario).getUTCDate()).padStart(2, "0");
            return (
              <Reveal key={b.id} delay={stagger(i, 0.04)} className="min-w-0">
              <SpotlightSurface tone="dark" className="h-full p-4.5! flex flex-col gap-3.5 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-[38px] h-[38px] rounded-full bg-[var(--color-navy-border)] text-white grid place-items-center font-[family-name:var(--font-display)] font-bold text-sm flex-none">
                    {initials(b.nome)}
                  </span>
                  <span className="font-mono text-[22px] font-semibold leading-none" style={{ color: "var(--color-accent-soft)" }}>
                    {day}
                  </span>
                  {today_ && (
                    <span className="ml-auto font-mono text-[9px] font-semibold tracking-[0.1em] uppercase bg-[var(--color-accent)] text-white px-1.5 py-1 rounded-[3px]">
                      hoje
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight break-words">{b.nome}</div>
                  {b.unidade && <div className="text-xs text-[#8b90a0] mt-0.5">{b.unidade}</div>}
                </div>
              </SpotlightSurface>
              </Reveal>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
