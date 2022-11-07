import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie } from '@/utils/cookie';

export const instance = axios.create({
  baseURL: 'https://localhost:7063/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  },
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const accessToken = getCookie('accessToken');

    if (accessToken) {
      config.headers!.Authorization = `Bearer ${accessToken}`;
      return config;
    }
    return config;
  },
  (error) => {
    console.log(error, 'error');
    return Promise.reject(error);
  }
);

// 401 에러 뜨면 토큰 만료인 경우이므로, 로그인 페이지로 이동 처리 로직 추가


instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('AxiosResponse', response);
    // localStorage.setItem('accessToken', response.data);
    return response;
  },
  (error) => {
    console.log('response error', error);
    return Promise.reject(error);
  }
);
