import { LCD_URL } from "@/constants";
import axios from "axios";

export async function getTransactions({
  events,
  pagination = { limit: 20, offset: 0 },
  orderBy = "ORDER_BY_UNSPECIFIED",
}) {
  const { offset, limit } = pagination;
  return axios.get(`${LCD_URL}/cosmos/tx/v1beta1/txs`, {
    params: {
      "pagination.offset": offset,
      "pagination.limit": limit,
      orderBy,
      events: events.map((evn) => `${evn.key}='${evn.value}'`),
    },
    paramsSerializer: {
      indexes: null,
    },
  });
}
