import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "@/components/common/Header";
import TonWallet from "@/components/main/TonWallet";
import useTonConnect from "@/hooks/contract/useTonConnect";

const tele = (window as any).Telegram.WebApp;

const Main = () => {
  const { address } = useTonConnect();

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
        <Input placeholder="enter message..." />
        <TonWallet />
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
