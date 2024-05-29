import axios from "axios";

// const base = "http://159.89.24.179:5000";
// const base = "http://128.140.108.218:4000";
const base = "https://awesome.cybernode.ai";

export function sendProof(data: any) {
  return axios.post(base + "/proof", data);
}
