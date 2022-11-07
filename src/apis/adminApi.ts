import { instance } from './config';
import { IBackAdminInfo } from '@/store/modules/module-admin';

export const adminApi = {
  // 관리자 로그인
  adminLogin: (userInfo: IBackAdminInfo) => {
    const data = instance.post('api/user/login', userInfo);
    return data;
  },
};
