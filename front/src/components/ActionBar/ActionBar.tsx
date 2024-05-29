import styles from "./ActionBar.module.scss";

function ActionBar({ children }) {
  return (
    <div className={styles.ActionBarContainer}>
      <div className={styles.ActionBarContainerContent}>{children}</div>
    </div>
  );
}


export default ActionBar;
