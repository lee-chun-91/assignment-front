import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const instance = axios.create({
  baseURL: 'https://localhost:7063/',
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');

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
