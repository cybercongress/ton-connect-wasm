import { Citizenship } from "@/types";
import Balances from "./ui/Balances/Balances";
import Avatar from "./ui/Avatar/Avatar";

function Passport({ passport }: { passport: Citizenship }) {
  const address = passport?.owner;
  const cid = passport?.extension.avatar;

  return (
    <div>
      {JSON.stringify(passport)}

      <Avatar cid={cid} />

      <Balances address={address} />

      {/* <MusicalAddress address={passport.owner} /> */}
    </div>
  );
}

export default Passport;
