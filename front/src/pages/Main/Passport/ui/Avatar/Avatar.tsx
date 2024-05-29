import { CYBER_GATEWAY } from '@/constants';
import styles from './Avatar.module.scss';

function Avatar({ cid }: {cid: string}) {

  const urlCid = `${CYBER_GATEWAY}/ipfs/${cid}`;

  return (
    <div className={styles.wrapper}>
      <img src={urlCid} alt="avatar" />
    </div>
  );
}

export default Avatar;