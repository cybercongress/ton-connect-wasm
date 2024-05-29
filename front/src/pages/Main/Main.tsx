import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "@/components/common/Header";
import TonWallet from "@/components/main/TonWallet";
import useTonConnect from "@/hooks/contract/useTonConnect";
import useCyberPassport from "@/hooks/useCyberPassport";
import { fromAscii, fromBase64 } from "@cosmjs/encoding";
import Stars from "@/components/stars";
import Button from "@/components/main/btnGrd";
import Display from "@/components/common/containerGradient/Display/Display";
import MainContainer from "@/components/MainContainer";
import { Input } from "@/components/Input";

const tele = (window as any).Telegram.WebApp;

const Main = () => {
  const { address, tonConnectUI, wallet, connected } = useTonConnect();

  const [passportProof, setPassportProof] = useState();
  const [textProof, setTextProof] = useState();

  const [message, setMessage] = useState("");

  const [nickname, setNickname] = useState("congress");

  console.log(wallet);
  console.log("PK", wallet?.account?.publicKey);

  const tonProof = wallet?.connectItems?.tonProof;

  // @ts-ignore
  const body = tonProof && fromAscii(fromBase64(tonProof?.proof?.payload));

  if (body) {
    const p = JSON.parse(body);

    const type = p.msg_type;
    const data = p.msg_data;

    if (type === "map_nickname" && !passportProof) {
      debugger;
      setPassportProof({
        ...tonProof,
        data: p,
      });
      tonConnectUI.disconnect();
    }

    if (type === "add_post" && !textProof) {
      debugger;
      setTextProof({
        ...tonProof,
        data: p,
      });
      tonConnectUI.disconnect();
    }
  }

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
      <MainContainer>
        <Stars />
        {/* <Display>
          <Button> dsls;lsd;</Button>
        </Display> */}
        <Header isOpen={false} text="CYBER-TON" backgroundType={false} />

        <Display>
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
          <TonWallet message={message} nickname={nickname} type="text" />

          {textProof && (
            <div
              style={{
                fontSize: 14,
              }}
            >
              <br />
              {JSON.stringify(textProof)}
            </div>
          )}
        </Display>

        <Display>
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

          <Button onClick={fetchData}>load passport</Button>

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

          <TonWallet nickname={nickname} type="passport" />

          {passportProof && (
            <div
              style={{
                fontSize: 14,
              }}
            >
              <br />
              {JSON.stringify(passportProof)}
            </div>
          )}

          {tonProof && (
            <div
              style={{
                fontSize: 14,
              }}
            >
              <br />
              {JSON.stringify(tonProof)}
            </div>
          )}
        </Display>
      </MainContainer>
    </>
  );
};

export default Main;

// const Input = styled.textarea`
//   width: 100%;
//   heigt: 200px;

//   border: none;

//   background-color: transparent;
//   ${({ theme }) => theme.fonts.Telegram_Title_3_1};
//   color: #45464f;

//   &::placeholder {
//     color: #e5e5ea;
//   }

//   outline: none;
// `;
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
