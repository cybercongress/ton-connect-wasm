import { Citizenship } from "@/types";
import Balances from "./ui/Balances/Balances";
import Avatar from "./ui/Avatar/Avatar";
import styles from './Passport.module.scss'
import TitleItem from "./ui/TitleItem/TitleItem";
import GreenText from "@/components/GreenText/GreenText";
import { trimString } from "@/utils/trimString";
import Karma from "./ui/Karma/Karma";
import CyberLink from "./ui/CyberLink/CyberLink";

function Passport({ passport }: { passport: Citizenship }) {
  const address = passport?.owner;
  const { nickname, avatar: cid } = passport.extension;

  return (
    <div className={styles.wrapper}>
      <Avatar cid={cid} />

      <TitleItem title="name">
        <GreenText>{nickname}</GreenText>
      </TitleItem>

      <TitleItem title="address">
        <GreenText>{trimString(address, 11, 4)}</GreenText>
      </TitleItem>

      <Karma address={address} />

      <CyberLink address={address} />

      <Balances address={address} />

      {/* <MusicalAddress address={passport.owner} /> */}
    </div>
  );
}

export default Passport;
