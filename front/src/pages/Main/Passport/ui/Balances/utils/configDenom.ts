import boot from "../assets/large-green.png";
import milliampere from "../assets/light.png";
import hydrogen from "../assets/hydrogen.svg";
import millivolt from "../assets/lightning.png";
import { Denom } from "../type";

type DenomItem = {
  denom: string;
  coinDecimals: number;
  img: string;
};

export type DenomListKey = keyof typeof Denom;

type DenomList = {
  [key in DenomListKey]: DenomItem;
};

export const configDenom: DenomList = {
  boot: {
    denom: "BOOT",
    img: boot,
    coinDecimals: 0,
  },
  hydrogen: {
    denom: "H",
    img: hydrogen,
    coinDecimals: 0,
  },
  milliampere: {
    denom: "A",
    img: milliampere,
    coinDecimals: 3,
  },
  millivolt: {
    denom: "V",
    img: millivolt,
    coinDecimals: 3,
  },
};
