import { getCyberLink } from "./api/getCyberLink";
import TitleItem from "../TitleItem/TitleItem";
import GreenText from "@/components/GreenText/GreenText";

function CyberLink({ address }: { address: string }) {
  const { data } = getCyberLink(address);

  if (!data) {
    return null;
  }

  return (
    <TitleItem title="cyberlinks">
      <GreenText>{data}</GreenText>
    </TitleItem>
  );
}

export default CyberLink;
