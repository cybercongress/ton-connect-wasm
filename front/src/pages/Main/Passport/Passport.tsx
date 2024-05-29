import { Citizenship } from "@/types";
import React from "react";

function Passport({ passport }: { passport: Citizenship }) {
  return (
    <div>
      {JSON.stringify(passport)}

      {/* <MusicalAddress address={passport.owner} /> */}
    </div>
  );
}

export default Passport;
