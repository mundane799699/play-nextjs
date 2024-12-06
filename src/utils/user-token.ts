import Cookies from "js-cookie";
/**
 * 存储/获取 user token
 */

const TokenKey = "Admin-Token";

export function setToken(token: string) {
  Cookies.set(TokenKey, token, { expires: 30 });
}

export function getToken() {
  return Cookies.get(TokenKey) || "";
}

export function removeToken() {
  Cookies.remove(TokenKey);
}
