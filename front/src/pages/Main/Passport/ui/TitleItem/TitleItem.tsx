import { ReactNode } from "react";
import styles from './TitleItem.module.scss';

function TitleItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      {children}
    </div>
  );
}

export default TitleItem;
