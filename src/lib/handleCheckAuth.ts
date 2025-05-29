import { isTokenExpired } from "./isTokenExpired";

export const handleCheckAuth = () => {
  const refresh_token = localStorage.refreshToken;
  const access_token = localStorage.accessToken;
  const role = localStorage.getItem('role');

  if (!refresh_token || !access_token || isTokenExpired(access_token)) {
    localStorage.accessToken = ""
    return { isAuth: false, role: 'user' };
  }

  return { isAuth: true, role };
};
