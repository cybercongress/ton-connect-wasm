import BigNumber from "bignumber.js";

export function getDisplayAmount(
  rawAmount: number | string,
  precision: number
): number {
  return parseFloat(
    new BigNumber(rawAmount)
      .shiftedBy(-precision)
      .dp(precision, BigNumber.ROUND_FLOOR)
      .toFixed(precision > 0 ? 3 : 0, BigNumber.ROUND_FLOOR)
  );
}
