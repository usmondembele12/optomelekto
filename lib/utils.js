export function formatPrice(number) {
  if (typeof number !== "number" || isNaN(number)) {
    number = 0;
  }
  return new Intl.NumberFormat("uz-UZ").format(number) + " so'm";
}

export function truncate(str, max = 80) {
  if (!str) return "";
  if (str.length <= max) return str;
  return str.slice(0, max) + "...";
}
