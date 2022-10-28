import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
// import { userApi } from '@/apis/userApi';
import router from '@/router';
import { userApi } from '@/apis/userApi';

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

  @Action
  public async fetchLogin(userInfo: IAdminInfo) {
    const backUserInfo: IBackAdminInfo = {
      user_name: userInfo.userName,
      password: userInfo.password,
    };
    // console.log('userInfo', userInfo);
    // console.log('backUserInfo', backUserInfo);
    return new Promise((resolve, reject) => {
      userApi.adminLogin(backUserInfo)
        .then((res) => {
          localStorage.setItem('accessToken', res.data);
          localStorage.setItem('userName', userInfo.userName);
          this.login(userInfo.userName);
          router.push( { name: 'adminMain' });
        })
        .catch((error) => {
          reject(error.response.data); });
    });
  }

  @Action
  public fetchLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    this.logout();
    router.push( { name: 'signIn' });
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
