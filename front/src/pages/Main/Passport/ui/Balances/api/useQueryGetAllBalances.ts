import { useQueryClient } from "@/queryClient";
import { useQuery } from "@tanstack/react-query";

const balanceFetcher = (options, client) => {
  const { address } = options;

  if (!client || address === null) {
    return null;
  }

  return client.getAllBalances(address);
};

const useQueryGetAllBalances = (options) => {
  const queryClient = useQueryClient();
  const { address } = options;

  const { data } = useQuery({
    queryKey: ["getAllBalances", address],
    queryFn: () => balanceFetcher(options, queryClient),
    enabled: Boolean(queryClient && address),
  });

  return data;
};

export default useQueryGetAllBalances;
