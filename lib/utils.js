export function formatPrice(number) {
  if (typeof number !== "number" || isNaN(number)) {
    number = 0;
  }
  const formatted = Math.round(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} so'm`;
}

export function truncate(str, max = 80) {
  if (!str) return "";
  if (str.length <= max) return str;
  return str.slice(0, max) + "...";
}
