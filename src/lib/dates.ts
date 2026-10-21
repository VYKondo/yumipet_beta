const TZ = "America/Sao_Paulo";

function toSP(date: Date): Date {
  return new Date(date.toLocaleString("en-US", { timeZone: TZ }));
}

export function todaySP(): Date {
  return toSP(new Date());
}

export function tomorrowSP(): Date {
  const d = todaySP();
  d.setDate(d.getDate() + 1);
  return d;
}

export function startOfDaySP(date: Date): Date {
  const d = toSP(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDaySP(date: Date): Date {
  const d = toSP(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
