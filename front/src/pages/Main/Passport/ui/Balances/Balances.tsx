import useQueryGetAllBalances from "./api/useQueryGetAllBalances";
import { Denom } from "./type";
import { DenomListKey, configDenom } from "./utils/configDenom";
import styles from "./Balances.module.scss";
import TitleItem from "../TitleItem/TitleItem";
import { formatNumber } from "@/utils/formatNumber";
import BigNumber from "bignumber.js";
import { getDisplayAmount } from "@/utils/getDisplayAmount";

function BalancesItem({
  amount,
  denomValue,
}: {
  amount?: any;
  denomValue: DenomListKey;
}) {
  const { denom, coinDecimals, img } = configDenom[denomValue];

  return (
    <div className={styles.wrapperItem}>
      <span className={styles.denom}>{denom}</span>
      <div className={styles.amount}>
        <span>{formatNumber(getDisplayAmount(amount || 0, coinDecimals))}</span>
        <img src={img} alt={denom} />
      </div>
    </div>
  );
}

function Balances({ address }: { address: string }) {
  const data = useQueryGetAllBalances({ address });

  if (!data) {
    return null;
  }

  const renderItem = Object.keys(Denom).map((key: DenomListKey) => {
    const { amount } = data.find((item) => item.denom === key);
    return <BalancesItem key={key} denomValue={key} amount={amount} />;
  });

  return (
    <div className={styles.container}>
      <TitleItem title="Balances">
        <div className={styles.wrapper}>{renderItem}</div>
      </TitleItem>
    </div>
  );
}

export default Balances;
