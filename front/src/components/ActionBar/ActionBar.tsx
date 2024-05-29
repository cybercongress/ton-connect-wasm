import React from "react";
import styles from "./ActionBar.module.scss";

function ActionBar({ children }) {
  return <div className={styles.wrapper}>{children}</div>;
}

export default ActionBar;
