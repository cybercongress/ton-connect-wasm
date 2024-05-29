import { useQueryClient } from "@/queryClient";
import { useQuery } from "@tanstack/react-query";

export const useGetKarma = (address: string) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["karma", address],
    queryFn: async () => {
   
        const response = await queryClient.karma(address);

        return response.karma;

    },
    enabled: Boolean(queryClient && address),
  });

  return { data };
};
