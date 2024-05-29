import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import IcWalletConnect from "../../assets/icons/Landing/ic_wallet_connect.svg";
import IcWalletDisconnect from "../../assets/icons/Landing/ic_wallet_disconnect.svg";

import useTonConnect from "./../../hooks/contract/useTonConnect";
import { toBase64, fromBase64, fromAscii, toAscii } from "@cosmjs/encoding";
import Button from "./btnGrd";

const TonWallet = ({ nickname, message, type }) => {
  const { connected, tonConnectUI } = useTonConnect();

  const isPassportType = type === "passport";

  let data;
  if (isPassportType) {
    data = JSON.stringify({
      msg_type: "map_nickname",
      msg_data: nickname,
    });
  } else if (message) {
    data = JSON.stringify({
      msg_type: "add_post",
      msg_data: message,
    });
  }

  const handleSwitchWalletFunction = () => {
    if (connected) {
      console.log(">>> Send message to bacend");
    } else {
      const d = toBase64(toAscii(data));

      tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: {
          tonProof: d,
        },
      });

      tonConnectUI.connectWallet();
    }
  };

  return (
    // <TonWalletWrapper onClick={handleSwitchWalletFunction}>

    <div
      style={{
        position: "relative",
      }}
    >
      <Button onClick={handleSwitchWalletFunction}>
        {/* <TonConnectCenterBox> */}
        {isPassportType ? "Passport" : "Text"} proof
        {/* </TonConnectCenterBox> */}
      </Button>
      <p
        style={{
          position: "absolute",
          bottom: "-5px",
        }}
      >
        {JSON.stringify(data)}
      </p>
    </div>
  );
};

export default TonWallet;

const TonWalletWrapper = styled.div`
  /* display: flex; */
  /* justify-content: center;
  align-items: center;
  position: relative;

  width: 100%;
  height: 6rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0;

  border-radius: 2.4rem;
  /* background-color: #1f53ff; */
  /* color: #f2f2f7; */
  /* ${({ theme }) => theme.fonts.Nexton_Body_Text_Medium} */ */

  /* filter: drop-shadow(0px 6px 10px rgba(94, 97, 98, 0.30)); */
  /* cursor: pointer; */
`;

const TonConnectStatusBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;

  width: 5rem;
  height: 5rem;

  border-radius: 2rem;
  background-color: #fff;
`;

const TonConnectCenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  color: #f2f2f7;
  ${({ theme }) => theme.fonts.Nexton_Body_Text_Medium};
`;
