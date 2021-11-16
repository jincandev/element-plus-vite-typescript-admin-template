import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthToken } from "./AuthToken";
import Storage from "./storage";

const request = axios.create({
  baseURL: (import.meta.env.VITE_BASE_URL || "") as string,
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = AuthToken.get();
    const lang = Storage.get("languate") || "zh";
    if(!config.headers) {
      config.headers = {}
    }
    if (token) {
      config.headers.authorization = token;
    }
    config.headers.lang = lang;
    return config;
  },
  (error: any) => {}
);

// 响应拦截器
request.interceptors.response.use(async (response: AxiosResponse) => {
    return response
}, (error: any) => {})

export default request