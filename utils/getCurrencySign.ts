export function getCurrencySign(code: string): string {
  const map: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CZK: "Kč",
    PLN: "zł",
    CHF: "CHF",
    JPY: "¥",
    CNY: "¥",
  };

  return map[code.toUpperCase()] ?? code;
}
