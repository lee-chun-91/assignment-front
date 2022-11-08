import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie } from '@/utils/cookie';
import { PageNames } from '@/enum/page-names';
import router from '@/router';
import { useRouter } from 'vue-router/composables';
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import { NoticeMessage } from '@/enum/notice-message';

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

    console.log();

    if (router.currentRoute.name === PageNames.signIn) {
      Message({
        type: 'info',
        message: error.response.data
      });
    }
    // else if (router.currentRoute.name === PageNames.signIn) {
    //   MessageBox({
    //     type: 'info',
    //     message: error.response.data,
    //     confirmButtonText: '확인'
    //   });
    // }
    else if (error.response.status === 401) {
      MessageBox({
        type: 'info',
        message: NoticeMessage.expireToken,
        confirmButtonText: NoticeMessage.goSignInPage,
        callback: () => {
          router.push({ name: PageNames.signIn });
        }
      });
    }

    return Promise.reject(error);
  }
);
