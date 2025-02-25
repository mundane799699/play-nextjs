import axios from "./ajax";

export async function fetchMemberInfo() {
  return await axios.get("/system/user/fetchMemberInfo");
}
