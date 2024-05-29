import { getTransactions } from "@/utils/getTransactions";
import { useQuery } from "@tanstack/react-query";

async function getCyberlinksTotal(address: string) {
  const events = [
    { key: "message.action", value: "/cyber.graph.v1beta1.MsgCyberlink" },
    { key: "cyberlink.neuron", value: address },
  ];

  const response = await getTransactions({
    pagination: { offset: 0, limit: 1 },
    events,
  });

  return response.data?.pagination?.total;
}

export const getCyberLink = (address: string) => {
  const { data } = useQuery({
    queryKey: ["cyberlink", address],
    queryFn: async () => {
      return getCyberlinksTotal(address);
    },
    enabled: Boolean(address),
  });

  return { data };
};
