import React, { useEffect, useState } from "react";

import { toAscii, toBase64 } from "@cosmjs/encoding";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export async function getPassport(query) {
  const response = await axios.get(
    `${"https://lcd.bostrom.cybernode.ai"}/cosmwasm/wasm/v1/contract/${"bostrom1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfzhxel"}/smart/${toBase64(
      toAscii(JSON.stringify(query))
    )}`
  );
  return response.data.data;
}

function useCyberPassport({ nickname }) {
  const [data, setData] = useState();

  //  const data =  useQuery("passport", fetchData, {
  //     enabled: false,
  //   });

  useEffect(() => {
    setData(null);
  }, [nickname]);

  function fetchData() {
    const query = {
      passport_by_nickname: {
        nickname: nickname,
      },
    };

    getPassport(query)
      .then((res) => {
        setData(res);
      })
      .catch((e) => {
        console.log(e);

        setData(null);
      });
  }

  //   useEffect(() => {

  //   }, [nickname]);

  return {
    fetchData,
    data,
  };
}

export default useCyberPassport;
