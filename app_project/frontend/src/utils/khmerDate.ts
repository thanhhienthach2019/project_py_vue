// src/utils/khmerDate.ts

export const khmerMonths = [
  "មករា",    // January
  "កម្ភៈ",    // February
  "មិនា",     // March
  "មេសា",     // April
  "ឧសភា",     // May
  "មិថុនា",   // June
  "កក្កដា",    // July
  "សីហា",     // August
  "កញ្ញា",    // September
  "តុលា",     // October
  "វិច្ឆិកា",  // November
  "ធ្នូ",     // December
];

export function formatDateKhmer(dateStr: string | Date): string {
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const day = d.getDate();
  const month = khmerMonths[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateRangeKhmer(startStr: string | Date, endStr?: string | Date): string {
  const start = typeof startStr === 'string' ? new Date(startStr) : startStr;
  const end = endStr ? (typeof endStr === 'string' ? new Date(endStr) : endStr) : null;

  const startDay = start.getDate();
  const startMonth = khmerMonths[start.getMonth()];
  const startYear = start.getFullYear();

  if (!end) {
    return `${startDay} ${startMonth} ${startYear}`;
  }

  const endDay = end.getDate();
  const endMonth = khmerMonths[end.getMonth()];
  const endYear = end.getFullYear();

  if (startYear === endYear && startMonth === endMonth) {
    return `${startDay} - ${endDay} ${endMonth} ${endYear}`;
  }

  return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
}