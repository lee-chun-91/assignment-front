import axios, { AxiosRequestConfig } from 'axios';

export const instance = axios.create({
  baseURL: 'https://localhost:7063/',
  headers: {
    'content-Type': 'application/json;charset=utf-8',
  },
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');

    if (config && accessToken) {
      config.headers!['authorization'] = accessToken;
      return config;
    }
    return config;
  },
  (error) => {
    console.log(error, 'error');
    return;
  }
);
