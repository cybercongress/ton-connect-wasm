import { useCallback, useEffect, useState } from "react";
// import { Address } from "@ton/core";
import { toUserFriendlyAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export default function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [address, setAddress] = useState("");

  const getAddress = useCallback(() => {
    const addr = wallet?.account?.address;
    if (addr) {
      setAddress(toUserFriendlyAddress(addr, true));
      //TODO: can be usefull

      // const addr = Address.parse(wallet.account.address);
    }
  }, [wallet?.account?.address]);

  useEffect(() => {
    getAddress();
  }, [wallet?.account?.address, getAddress]);

  return {
    tonConnectUI,
    wallet,
    sender: {
      send: async (args: any) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: wallet?.account.address ? true : false,
    pureAddress: wallet?.account.address,
    network: wallet?.account.chain,
    address,
  };
}
