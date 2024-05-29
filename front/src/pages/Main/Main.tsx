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
import DisplayTitle from "@/components/common/containerGradient/DisplayTitle/DisplayTitle";
import { Citizenship } from "@/types";
import MusicalAddress from "@/components/MusicalAddress/MusicalAddress";
import Passport from "./Passport/Passport";
import ActionBar from "@/components/ActionBar/ActionBar";
import { sendProof } from "@/api/cyber";

const tele = (window as any).Telegram.WebApp;

enum Steps {
  INITIAL,
  ENTER_PASSPORT,
  ADD_PASSPORT,
  ENTER_MESSAGE,
}

const Main = () => {
  const { address, tonConnectUI, wallet, connected } = useTonConnect();

  const [passportProof, setPassportProof] = useState();
  const [textProof, setTextProof] = useState();

  const [step, setStep] = useState(Steps.INITIAL);

  const [message, setMessage] = useState("");

  const [nickname, setNickname] = useState("congress");

  console.log(wallet);
  console.log("PK", wallet?.account?.publicKey);

  const tonProof = wallet?.connectItems?.tonProof;

  console.log("tonProof", tonProof);

  async function sendProofCall() {
    try {
      const { address, publicKey } = wallet.account || {};

      const d = {
        proof: {
          proof: {
            ...tonProof.proof,
            state_init: "",
          },
          network: "-239",
          address,
        },
        pubkey: publicKey,
      };
      const data = await sendProof(d);

      console.log(data.data);
    } catch (error) {
      console.error(error);
    }
  }

  // @ts-ignore
  const body = tonProof && fromAscii(fromBase64(tonProof?.proof?.payload));

  if (body) {
    const p = JSON.parse(body);

    const type = p.msg_type;
    const data = p.msg_data;

    if (type === "map_nickname" && !passportProof) {
      sendProofCall();
      setPassportProof({
        ...tonProof,
        data: p,
      });
      tonConnectUI.disconnect();
    }

    if (type === "add_post" && !textProof) {
      sendProofCall();
      setTextProof({
        ...tonProof,
        data: p,
      });
      tonConnectUI.disconnect();
    }
  }

  const { data: dat2, fetchData } = useCyberPassport({
    nickname,
  });

  const passport = dat2 as Citizenship;

  useEffect(() => {
    if (passport) {
      setStep(Steps.ADD_PASSPORT);
    }
  }, [passport]);

  useEffect(() => {
    if (passportProof) {
      setStep(Steps.ENTER_MESSAGE);
    }
  }, [passportProof]);

  useEffect(() => {
    if (tele) {
      tele.ready();
      tele.BackButton.hide();
    }
  }, []);

  let centerContent;
  let actionBarContent;
  if (step === Steps.INITIAL) {
    actionBarContent = (
      <Button onClick={() => setStep(Steps.ENTER_PASSPORT)}>
        Add passport
      </Button>
    );

    centerContent = (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
        doloremque quos cum, itaque soluta suscipit totam minima, nemo impedit
        provident iure deserunt ducimus fugiat velit ex mollitia repellat
        tempora. Illo qui praesentium ducimus consequuntur nemo nihil! Ex ipsum
        natus vitae vel maxime impedit fuga tempore architecto quae minima omnis
        eius possimus quis quos tempora repudiandae veniam, optio provident
        nesciunt dolore iusto eligendi. Sunt, similique? Ullam atque repellat
        itaque vel illum! Totam corporis aliquam dicta expedita doloribus qui id
        nisi quisquam tempore perferendis, praesentium alias quia dignissimos
        facilis rem sequi, quae ratione consequuntur itaque. Itaque id illum
        quisquam, reprehenderit harum consequatur.
      </>
    );
  } else if (step === Steps.ENTER_PASSPORT) {
    actionBarContent = (
      <>
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
      </>
    );
  } else if (step === Steps.ADD_PASSPORT) {
    actionBarContent = (
      <>
        your passport is {passport?.owner}
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
      </>
    );
  } else if (step === Steps.ENTER_MESSAGE) {
    actionBarContent = (
      <>
        <Input
          color="pink"
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
      </>
    );
  }

  console.log(step);

  return (
    <>
      <MainContainer>
        <Stars />
        <Header isOpen={false} text="CYBER-TON" backgroundType={false} />

        <Button onClick={() => setStep(Steps.ENTER_MESSAGE)}>
          To cyberlink step
        </Button>

        {centerContent}

        {passport && (
          <Display title={<DisplayTitle title="Passport" />}>
            <div
              style={{
                fontSize: 14,
                wordBreak: "break-all",
              }}
            >
              <Passport passport={passport} />
            </div>
          </Display>
        )}

        {textProof && (
          <Display>
            <DisplayTitle title="Message" />
            <div
              style={{
                fontSize: 14,
                wordBreak: "break-all",
              }}
            >
              {JSON.stringify(textProof)}
            </div>
          </Display>
        )}

        <ActionBar>{actionBarContent}</ActionBar>
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
