import { ReactNode } from "react";
import styles from "./GreenText.module.scss";

function GreenText({ children }: { children: ReactNode }) {
  return <span className={styles.colorText}>{children}</span>;
}

export default GreenText;
