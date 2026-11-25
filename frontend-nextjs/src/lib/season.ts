/**
 * Decoração sazonal de Natal (neve nas áreas escuras do site).
 * Liga sozinha de 20/nov a 06/jan, então não precisa lembrar de desligar.
 */
export function isChristmasSeason(date: Date = new Date()): boolean {
  const month = date.getMonth(); // 0 = jan
  const day = date.getDate();
  if (month === 10) return day >= 20; // novembro
  if (month === 11) return true; // dezembro
  if (month === 0) return day <= 6; // janeiro
  return false;
}
