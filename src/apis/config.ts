import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const instance = axios.create({
  baseURL: 'https://localhost:7063/',
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

// instance.interceptors.response.use(
// (response: AxiosResponse) => {
// console.log('response', response);
// localStorage.setItem('accessToken', response.data);
// return response;
// },
// (error) => {
// console.log('error', error.response.data);
// return Promise.reject(error);
// }
// );
