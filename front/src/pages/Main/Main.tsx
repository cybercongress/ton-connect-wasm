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
import { trimString } from "@/utils/trimString";
import styles from "./Main.module.scss";
import Posts from "./Posts/Posts";
import { useQueryClientPussy } from "@/queryClientPussy";
import { useQuery } from "@tanstack/react-query";

const tele = (window as any).Telegram.WebApp;

enum Steps {
  INITIAL,
  ENTER_PASSPORT,
  ADD_PASSPORT,
  ENTER_MESSAGE,
  TX,
}

const Main = () => {
  const { address, tonConnectUI, wallet, connected } = useTonConnect();

  const [passportProof, setPassportProof] = useState();
  const [textProof, setTextProof] = useState();
  const [apiLoading, setApiLoading] = useState(false);

  const [step, setStep] = useState(Steps.INITIAL);

  const [message, setMessage] = useState("");

  const client = useQueryClientPussy();

  const publicKey = wallet?.account?.publicKey;
  const contractQuery = useQuery({
    queryKey: ["passport", publicKey],
    // refetchInterval: 10 * 1000,
    queryFn: async () => {
      return client!.queryContractSmart(
        "pussy15s8v0pa5g60uhvmjpfj73p6nem6t597e8qnkgpsuck5tje3se7ps3ll7kl",
        {
          get_nickname: {
            pubkey: publicKey,
          },
        }
      );
    },
    enabled: !!publicKey,
  });

  const [txHash, setTxHash] = useState();

  const [nickname, setNickname] = useState();

  console.log(wallet);
  console.log("PK", wallet?.account?.publicKey);

  const tonProof = wallet?.connectItems?.tonProof;

  console.log("tonProof", tonProof);

  async function sendProofCall() {
    try {
      setApiLoading(true);
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
      const tx = data.data.tx.hash;

      setTxHash(tx);
    } catch (error) {
      console.error(error);
    }
    setApiLoading(false);
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
    }

    if (type === "add_post" && !textProof) {
      sendProofCall();
      setTextProof({
        ...tonProof,
        data: p,
      });
      setMessage("");
    }
  }

  const { data: dat2, fetchData } = useCyberPassport({
    nickname,
  });

  useEffect(() => {
    if (contractQuery.data) {
      const nick = contractQuery.data;
      if (nick !== nickname) {
        setNickname(nick);

        setTimeout(() => {
          fetchData(nick);
        }, 1000);
      }

      setStep(Steps.ENTER_MESSAGE);
    }
  }, [contractQuery.data, nickname, fetchData]);

  const passport = dat2 as Citizenship;

  console.log(passport);

  useEffect(() => {
    if (passport) {
      setStep(Steps.ADD_PASSPORT);
    }
  }, [passport]);

  useEffect(() => {
    if (passportProof) {
      setStep(Steps.ENTER_MESSAGE);
    }
  }, [passportProof, passport]);

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
      <Display>
        <div className={styles.info}>
          Hello hacker!
          <br />
          <br />
          <br />
          <br />
          <br />
          Use your <strong>moon passport</strong> from{" "}
          <a
            style={{
              color: "#36d6ae",
              textDecoration: "none",
            }}
            href="https://cyb.ai"
          >
            cyb.ai
          </a>{" "}
          to start posting with{" "}
          <span
            style={{
              color: "#24A1DE",
            }}
          >
            telegram
          </span>
          !
        </div>
      </Display>
    );
  } else if (step === Steps.ENTER_PASSPORT) {
    actionBarContent = (
      <>
        <Input
          value={nickname}
          placeholder="enter passport..."
          onChange={(e) => {
            const value = e.target.value;

            setNickname(value);
          }}
        />

        <Button onClick={fetchData}>load passport</Button>
      </>
    );
  } else if (step === Steps.ADD_PASSPORT) {
    actionBarContent = (
      <>
        {/* your passport is {trimString(passport?.owner, 6, 6)} */}
        <TonWallet nickname={nickname} type="passport" />
        {/* {passportProof && (
          <div
            style={{
              fontSize: 14,
            }}
          >
            <br />
            {JSON.stringify(passportProof)}
          </div>
        )} */}
      </>
    );
  } else if (step === Steps.ENTER_MESSAGE) {
    centerContent = <Posts publicKey={wallet?.account?.publicKey || ""} />;

    if (txHash) {
      actionBarContent = (
        <>
          <a
            className={styles.tx}
            target="_blank"
            rel="noreferrer noopener"
            href={"https://spacepussy.ai/network/bostrom/tx/" + txHash}
          >
            {" "}
            {trimString(txHash, 6, 6)}
          </a>

          <Button onClick={() => setTxHash(null)}>Close</Button>
        </>
      );
    } else if (apiLoading) {
      actionBarContent = (
        <>
          <Button disabled>pending...</Button>
        </>
      );
    } else {
      actionBarContent = (
        <>
          <Input
            color="pink"
            placeholder="enter message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <TonWallet message={message} nickname={nickname} type="text" />
        </>
      );
    }
  }

  console.log(step);

  return (
    <>
      <MainContainer>
        <Stars />
        <Header isOpen={false} text="CYBER-TON" backgroundType={false} />

        <div
          style={{
            zIndex: 1,
          }}
        >
          {centerContent}
        </div>

        {passport && (
          <Display
            title={
              <DisplayTitle
                title={
                  <div className={styles.passportHeader}>
                    moon passport
                    <button
                      className={styles.resetBtn}
                      onClick={() => {
                        setStep(Steps.INITIAL);
                        setNickname("");
                        localStorage.removeItem(LS_KEY);
                      }}
                      title="reset passport"
                    >
                      reset passport
                    </button>
                  </div>
                }
              />
            }
          >
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

        {/* {textProof && (
          <Display title={<DisplayTitle title="message" />}>
            <div
              style={{
                fontSize: 14,
                wordBreak: "break-all",
              }}
            >
              {JSON.stringify(textProof)}
            </div>
          </Display>
        )} */}

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
