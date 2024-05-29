import { Citizenship } from "@/types";
import React from "react";
import Balances from "./ui/Balances/Balances";

function Passport({ passport }: { passport: Citizenship }) {

  const address = passport?.owner;

  return (
    <div>
      {JSON.stringify(passport)}

      <Balances address={address} />

      {/* <MusicalAddress address={passport.owner} /> */}
    </div>
  );
}

export default Passport;
