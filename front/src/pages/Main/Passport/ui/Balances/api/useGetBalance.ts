/* eslint-disable no-restricted-syntax */
import { Decimal } from "@cosmjs/math";
import BigNumber from "bignumber.js";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@/queryClient";
import { BASE_DENOM } from "@/constants";
import { getDelegatorDelegations } from "./getDelegatorDelegations";

const initValue = {
  denom: BASE_DENOM,
  amount: "0",
};

export const initValueMainToken = {
  liquid: { ...initValue },
  frozen: { ...initValue },
  melting: { ...initValue },
  growth: { ...initValue },
  total: { ...initValue },
};

const initValueResponseFunc = (denom = "", amount = 0) => {
  return { denom, amount };
};

const getDelegationsAmount = (data) => {
  let delegationsAmount = new BigNumber(0);
  if (data.length) {
    data.forEach((itemDelegation) => {
      delegationsAmount = delegationsAmount.plus(itemDelegation.balance.amount);
    });
  }
  return initValueResponseFunc(BASE_DENOM, delegationsAmount.toNumber());
};

const getUnbondingAmount = (data) => {
  let unbondingAmount = new BigNumber(0);
  const { unbondingResponses } = data;
  if (unbondingResponses && Object.keys(unbondingResponses).length > 0) {
    unbondingResponses.forEach((unbond) => {
      unbond.entries.forEach((entry) => {
        unbondingAmount = unbondingAmount.plus(entry.balance);
      });
    });
  }
  return initValueResponseFunc(BASE_DENOM, unbondingAmount.toNumber());
};

const getRewardsAmount = (data) => {
  let rewardsAmount = new BigNumber(0);
  const { total } = data;
  if (total && total.length > 0) {
    const [{ amount }] = total;
    rewardsAmount = rewardsAmount.plus(
      Decimal.fromAtomics(amount, 18).floor().toString()
    );
  }
  return initValueResponseFunc(BASE_DENOM, rewardsAmount.toNumber());
};

export const useGetBalance = (addressBech32: string) => {
  const client = useQueryClient();

  try {
    const { data, isFetching } = useQuery({
      queryKey: ["getBalance", addressBech32],
      queryFn: async () => {
        const responsegetBalance = await client.getBalance(
          addressBech32,
          BASE_DENOM
        );

        const responsedelegatorDelegations = await getDelegatorDelegations(
          client,
          addressBech32
        );

        const delegationsAmount = getDelegationsAmount(
          responsedelegatorDelegations
        );

        const responsedelegatorUnbondingDelegations =
          await client.delegatorUnbondingDelegations(addressBech32);

        const unbondingAmount = getUnbondingAmount(
          responsedelegatorUnbondingDelegations
        );

        const responsedelegationTotalRewards =
          await client.delegationTotalRewards(addressBech32);

        const rewardsAmount = getRewardsAmount(responsedelegationTotalRewards);

        const resultBalance = {
          liquid: responsegetBalance,
          frozen: delegationsAmount,
          melting: unbondingAmount,
          growth: rewardsAmount,
        };

        const total = Object.values(resultBalance).reduce((acc, item) => {
          return new BigNumber(acc).plus(item.amount).toString();
        }, 0);

        return {
          ...resultBalance,
          total: {
            denom: BASE_DENOM,
            amount: total,
          },
        };
      },
      enabled: Boolean(client && addressBech32),
    });

    if (data && data !== null && !isFetching) {
      return data;
    }

    return undefined;
  } catch (error) {
    console.log(`error`, error);
    const tempObj = { ...initValueMainToken };
    delete tempObj.total;
    return { ...tempObj };
  }
};
