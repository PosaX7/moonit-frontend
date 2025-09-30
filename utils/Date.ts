// utils/date.ts
export const formatDateFR = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
