import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie } from '@/utils/cookie';
import { PageRouteNames } from '@/enum/page-names';
import router from '@/router';
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import { NoticeMessages } from '@/enum/notice-messages';

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

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {

    if (router.currentRoute.name === PageRouteNames.signIn) {
      Message({
        type: 'info',
        message: error.response.data
      });
    }

    else if (error.response.status === 401) {
      MessageBox({
        type: 'info',
        message: NoticeMessages.expireToken,
        confirmButtonText: NoticeMessages.goToPageSignIn,
        callback: () => {
          router.push({ name: PageRouteNames.signIn });
        }
      });
    }

    return Promise.reject(error);
  }
);
