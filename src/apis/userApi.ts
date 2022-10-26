import { instance } from './config';

export const userApi = {
  // 관리자 로그인
  adminLogin: (userInfo: { username: string, password: string}) => {
    const data = instance.post('api/user/login', userInfo);
    return data;
  },

  // 관리자 로그인 체크
  isLogin: () => {return;},

  // 설문 응답 유저 체크
  responseUserCheck: () => {return;}
};
