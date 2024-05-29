import IconsNumber from "@/components/IconsNumber/IconsNumber";
import styles from "./Karma.module.scss";
import { useGetKarma } from "./api/useGetKarma";
import TitleItem from "../TitleItem/TitleItem";

function Karma({ address }: { address: string }) {
  const { data } = useGetKarma(address);

  if (!data) {
    return null;
  }

  return (
    <TitleItem title="karma">
      <span className={styles.containerKarma}>
        <IconsNumber value={data} type="karma" />
      </span>
    </TitleItem>
  );
}

export default Karma;
