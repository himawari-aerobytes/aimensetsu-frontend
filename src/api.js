import axios from "axios";
import { fetchAuthSession } from "@aws-amplify/auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const authTokens = (await fetchAuthSession()).tokens.idToken.toString();

  if (authTokens) {
    config.headers.Authorization = `Bearer ${authTokens}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    if (error.response.status === 401) {
      alert("セッションが切れました。再度ログインしてください。");
      window.location.href = "/login/";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
