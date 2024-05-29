function numberWithCommas(x) {
  const parts = x.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

export const formatNumber = (number: number | string): string => {
  let formatted = number;

  if (typeof number === "string") {
    return numberWithCommas(formatted);
  }

  return formatted
    .toLocaleString("en")
    .replace(/(\.\d{0,})0+$/, "$1")
    .replace(/,/g, " ");
};
