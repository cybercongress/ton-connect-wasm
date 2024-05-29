import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "@/components/common/Header";
import TonWallet from "@/components/main/TonWallet";
import useTonConnect from "@/hooks/contract/useTonConnect";
import useCyberPassport from "@/hooks/useCyberPassport";
import { fromAscii, fromBase64 } from "@cosmjs/encoding";

const tele = (window as any).Telegram.WebApp;

const Main = () => {
  const { address, tonConnectUI, wallet, connected } = useTonConnect();

  const [message, setMessage] = useState("");

  const [nickname, setNickname] = useState("congress");

  const tonProof = wallet?.connectItems?.tonProof;

  const { data: passport, fetchData } = useCyberPassport({
    nickname,
  });

  useEffect(() => {
    if (tele) {
      tele.ready();
      tele.BackButton.hide();
    }
  }, []);

  return (
    <>
      <MainWrapper>
        <Header isOpen={false} text="CYBER-TON" backgroundType={false} />
        <Input
          placeholder="enter message..."
          value={message}
          onChange={(e) => {
            if (connected) {
              tonConnectUI.disconnect();
            }

            setMessage(e.target.value);
          }}
        />
        <TonWallet message={message} nickname={nickname} />

        <br />

        <Input
          value={nickname}
          placeholder="enter passport..."
          onChange={(e) => {
            const value = e.target.value;

            if (connected) {
              tonConnectUI.disconnect();
            }

            setNickname(value);
          }}
        />

        <button onClick={fetchData}>Load</button>

        {passport && (
          <div
            style={{
              fontSize: 14,
              wordBreak: "break-all",
            }}
          >
            {JSON.stringify(passport)}
          </div>
        )}

        {tonProof && (
          <div
            style={{
              fontSize: 14,
            }}
          >
            {fromAscii(fromBase64(tonProof?.proof?.payload))}

            <br />
            {JSON.stringify(tonProof)}
          </div>
        )}
      </MainWrapper>
    </>
  );
};

export default Main;

const Input = styled.textarea`
  width: 100%;
  heigt: 200px;

  border: none;

  background-color: transparent;
  ${({ theme }) => theme.fonts.Telegram_Title_3_1};
  color: #45464f;

  &::placeholder {
    color: #e5e5ea;
  }

  outline: none;
`;
const MainWrapper = styled.div`
  width: 100%;
  height: auto;
  min-height: 100%;

  background-color: #fff;
`;

export const MainBorder = styled.div`
  width: 100%;
  height: 1rem;

  background-color: #f1f4f4;
`;
