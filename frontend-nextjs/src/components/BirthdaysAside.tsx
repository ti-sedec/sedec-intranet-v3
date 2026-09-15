import type { Aniversariante } from "@/src/types/strapi";
import { initials, monthLabel } from "@/src/lib/format";

function isToday(dataAniversario: string, today: Date): boolean {
  const d = new Date(dataAniversario);
  return d.getUTCMonth() === today.getMonth() && d.getUTCDate() === today.getDate();
}

export function BirthdaysAside({ birthdays }: { birthdays: Aniversariante[] }) {
  const today = new Date();

  return (
    <div className="bg-[var(--color-ink)] text-white rounded-md p-5">
      <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--color-accent-soft)" }}>
        Mural
      </span>
      <div className="border-b border-[var(--color-navy-border)] pb-3 mt-1.5 mb-4">
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl m-0" style={{ letterSpacing: "-0.5px" }}>
          Aniversariantes de {monthLabel(today)}
        </h2>
        {birthdays.length > 0 && (
          <p className="text-xs text-[#a8adbb] mt-1.5 mb-0">
            {birthdays.length} {birthdays.length === 1 ? "colega celebra" : "colegas celebram"} neste mês.
          </p>
        )}
      </div>
      {birthdays.length === 0 ? (
        <p className="text-sm text-[#8b90a0] m-0">Nenhum aniversariante neste mês.</p>
      ) : (
        <div className="relative">
          <div className="scroll-dark flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1.5">
            {birthdays.map((b) => {
              const day = String(new Date(b.dataAniversario).getUTCDate()).padStart(2, "0");
              return (
                <div
                  key={b.id}
                  className="flex items-center gap-3 bg-[var(--color-navy-panel)] border border-[var(--color-navy-border)] rounded-[5px] px-3 py-2.5 min-w-0 hover:border-[var(--color-accent)]"
                >
                  <span className="w-8 h-8 rounded-full bg-[var(--color-navy-border)] text-white grid place-items-center font-[family-name:var(--font-display)] font-bold text-[11px] flex-none">
                    {initials(b.nome)}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight truncate">{b.nome}</div>
                    {b.unidade && <div className="text-xs text-[#8b90a0] mt-0.5 truncate">{b.unidade}</div>}
                  </div>
                  <span className="ml-auto font-mono text-base font-semibold leading-none flex-none" style={{ color: "var(--color-accent-soft)" }}>
                    {day}
                  </span>
                  {isToday(b.dataAniversario, today) && (
                    <span className="font-mono text-[9px] font-semibold tracking-[0.1em] uppercase bg-[var(--color-accent)] text-white px-1.5 py-1 rounded-[3px] flex-none">
                      hoje
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-1.5 h-6 bg-gradient-to-t from-[var(--color-ink)] to-transparent" />
        </div>
      )}
    </div>
  );
}
