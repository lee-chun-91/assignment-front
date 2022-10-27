import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
// import { userApi } from '@/apis/userApi';
import router from '@/router';
import { userApi } from '@/apis/userApi';

export interface IAdminInfo {
  username: string,
  password: string,
}

@Module({ namespaced: true, name: 'admin' })
export default class ModuleAdmin extends VuexModule {
  // 초기값
  username = '';
  isLogin = false;

  @Mutation
  private login(username: string) {
    this.username = username;
    this.isLogin = true;
  }

  @Mutation
  private logout() {
    this.username = '';
    this.isLogin = false;
  }

  @Mutation
  private setLoggedInfo(username: string) {
    this.username = username;
    this.isLogin = true;
  }

  @Action
  public async fetchLogin(userInfo: IAdminInfo) {
    return new Promise((resolve, reject) => {
      userApi.adminLogin(userInfo)
        .then((res) => {
          localStorage.setItem('accessToken', res.data);
          localStorage.setItem('username', userInfo.username);
          this.login(userInfo.username);
          router.push( { name: 'adminMain' });
        })
        .catch((error) => {
          reject(error.response.data); });
    });
  }

  @Action
  public fetchLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    this.logout();
    router.push( { name: 'signIn' });
  }

  @Action
  public fetchSetLoggedInfo() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');

    if (username && token) {
      this.setLoggedInfo(username);
    }
  }

  // @Action
  // public loginCheck() {
  //   if (localStorage.getItem('accessToken')) {
  //     return;
  //   } else {
  //     router.push({
  //       name: 'signIn'
  //     });
  //   }
  // }
}
