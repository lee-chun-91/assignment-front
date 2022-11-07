import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import router from '@/router';
import { adminApi } from '@/apis/adminApi';

export interface IAdminInfo {
  userName: string,
  password: string,
}

export interface IBackAdminInfo {
  user_name: string,
  password: string,
}


@Module({ namespaced: true, name: 'admin' })
export default class ModuleAdmin extends VuexModule {
  // 초기값
  userName = '';
  isLogin = false;

  @Mutation
  private login(userName: string) {
    this.userName = userName;
    this.isLogin = true;
  }

  @Mutation
  private logout() {
    this.userName = '';
    this.isLogin = false;
  }

  @Mutation
  private setLoggedInfo(userName: string) {
    this.userName = userName;
    this.isLogin = true;
  }

  // ---------------------------MUTATION END----------------------------



  // ---------------------------ACTION START----------------------------

  @Action ({ rawError: true })
  public async fetchLogin(userInfo: IAdminInfo) {
    const backUserInfo: IBackAdminInfo = {
      user_name: userInfo.userName,
      password: userInfo.password,
    };
    return await adminApi.adminLogin(backUserInfo)
      .then((res) => {
        localStorage.setItem('accessToken', res.data);
        localStorage.setItem('userName', userInfo.userName);
        router.push( { name: '설문 목록' });
      })
      .catch((error) => {return Promise.reject(error.response.data);});
  }

  @Action
  public fetchLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    this.logout();
    router.push( { name: '로그인' });
  }

  @Action
  public fetchSetLoggedInfo() {
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('accessToken');

    if (userName && token) {
      this.setLoggedInfo(userName);
    }
  }
}
