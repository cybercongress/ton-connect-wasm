import useQueryGetAllBalances from "./api/useQueryGetAllBalances";
import { Denom } from "./type";
import { DenomListKey, configDenom } from "./utils/configDenom";
import styles from "./Balances.module.scss";
import { formatNumber } from "./utils/formatNumber";

function BalancesItem({
  amount,
  denom,
}: {
  amount?: any;
  denom: DenomListKey;
}) {
  return (
    <div className={styles.wrapperItem}>
      <span className={styles.denom}>{configDenom[denom].denom}</span>
      <div className={styles.amount}>
        <span>{formatNumber(amount || 0)}</span>
        <img src={configDenom[denom].img} alt={denom} />
      </div>
    </div>
  );
}

function Balances({ address }: { address: string }) {
  const data = useQueryGetAllBalances({ address });

  if (data) {
    const renderItem = Object.keys(Denom).map((key: DenomListKey) => {
      const { amount } = data.find((item) => item.denom === key);
      return <BalancesItem key={key} denom={key} amount={amount} />;
    });

    return (
      <div className={styles.wrapper}>
        <span className={styles.title}>balances</span>
        <div className={styles.wrapperList}>{renderItem}</div>
      </div>
    );
  }

  return null;
}

export default Balances;
